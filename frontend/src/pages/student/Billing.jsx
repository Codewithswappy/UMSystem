import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Download, Clock, CheckCircle2, AlertCircle, DollarSign, Loader2, IndianRupee, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { API_BASE_URL } from '../../services/api';

export default function StudentBilling() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/fees/myfees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFees(data.data);
      }
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (feeId) => {
    setProcessingId(feeId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/fees/${feeId}/pay`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ paymentMethod: 'Online Transfer' })
      });
      const data = await response.json();
      if (data.success) {
        setFees(fees.map(fee => fee._id === feeId ? { ...fee, status: 'Paid', paymentDate: new Date().toISOString() } : fee));
      } else {
        alert("Payment failed: " + data.message);
      }
    } catch (error) {
      console.error("Error paying fee:", error);
      alert("Error processing payment");
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate Summary
  const totalDue = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  
  const pendingFees = fees.filter(f => f.status === 'Pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const nextDueDate = pendingFees.length > 0 ? new Date(pendingFees[0].dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "No dues";

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-black" /></div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tuition & Fees</h1>
          <p className="text-gray-500 mt-1">Manage your academic payments and view history.</p>
        </div>
        <Button variant="outline" className="rounded-full border-gray-200 hover:bg-gray-50">
          <Download className="mr-2 h-4 w-4" /> Download Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black text-black border-none shadow-xl rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <CardContent className="p-8">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Outstanding</p>
            <h2 className="text-4xl font-bold mb-4">{formatCurrency(totalDue)}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" /> 
              <span>Due by {nextDueDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 shadow-sm rounded-3xl">
          <CardContent className="p-8">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Paid</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{formatCurrency(totalPaid)}</h2>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> 
              <span>Up to date</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 shadow-sm rounded-3xl flex flex-col justify-center items-center text-center p-6">
           <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
             <CreditCard className="h-6 w-6 text-gray-900" />
           </div>
           <h3 className="font-bold text-gray-900">Payment Method</h3>
           <p className="text-sm text-gray-500 mb-4">Visa ending in 4242</p>
           <Button variant="outline" size="sm" className="rounded-full text-xs">Manage</Button>
        </Card>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg">Fee Schedule</h3>
          <div className="text-sm text-gray-500">Academic Year 2024-2025</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.length > 0 ? fees.map((fee) => (
                <tr key={fee._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{fee.title}</div>
                    <div className="text-xs text-gray-500">{fee.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatCurrency(fee.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className={`
                      ${fee.status === 'Paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 
                        fee.status === 'Overdue' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 
                        'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'} 
                      border-none px-2.5 py-0.5 rounded-full font-medium
                    `}>
                      {fee.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {fee.status === 'Pending' || fee.status === 'Overdue' ? (
                      <Button 
                        size="sm" 
                        onClick={() => handlePay(fee._id)}
                        disabled={!!processingId}
                        className="rounded-full bg-black text-white hover:bg-gray-800 px-6"
                      >
                        {processingId === fee._id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Pay Now'}
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="rounded-full text-gray-500 hover:text-gray-900">
                        <Receipt className="h-4 w-4 mr-2" /> Receipt
                      </Button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No fee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
