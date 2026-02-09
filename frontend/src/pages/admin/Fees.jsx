import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Loader2, CheckCircle2, AlertCircle, Clock, IndianRupee, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { API_BASE_URL } from '../../services/api';

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFee, setNewFee] = useState({
    studentId: "",
    title: "",
    description: "",
    amount: "",
    dueDate: "",
    type: "Tuition"
  });

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/fees`, {
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

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFee)
      });
      const data = await response.json();
      if (data.success) {
        setFees([data.data, ...fees]);
        setIsCreateModalOpen(false);
        setNewFee({ studentId: "", title: "", description: "", amount: "", dueDate: "", type: "Tuition" });
        // Re-fetch to get populated student data
        fetchFees();
      }
    } catch (error) {
      console.error("Error creating fee:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredFees = fees.filter(fee => 
    fee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fee Management</h1>
          <p className="text-gray-500 mt-1">Manage student fees, tuition, and payments.</p>
        </div>
        <Button 
          className="w-full md:w-auto rounded-full bg-black text-white hover:bg-gray-800 shadow-lg px-6"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Assign Fee
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by student or fee title..." 
            className="pl-10 border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl border-gray-200">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-black" /></div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFees.length > 0 ? filteredFees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {fee.student?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{fee.student?.name || 'Unknown Student'}</div>
                          <div className="text-xs text-gray-500">{fee.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{fee.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{fee.description}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(fee.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={`
                        ${fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                          fee.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'} 
                        border-none px-2.5 py-0.5 rounded-full font-medium
                      `}>
                        {fee.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No fees found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Fee Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Assign New Fee</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCreateModalOpen(false)} className="rounded-full">
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-5 w-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
              <div className="p-6">
                <form onSubmit={handleCreateFee} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Student</Label>
                    <Select 
                      value={newFee.studentId} 
                      onValueChange={(value) => setNewFee({...newFee, studentId: value})}
                    >
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student._id} value={student._id}>{student.name} ({student.studentId})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Fee Title</Label>
                    <Input 
                      id="title" 
                      value={newFee.title}
                      onChange={(e) => setNewFee({...newFee, title: e.target.value})}
                      required 
                      placeholder="e.g., Semester Tuition"
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input 
                        id="amount" 
                        type="number"
                        value={newFee.amount}
                        onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                        required 
                        placeholder="0.00"
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input 
                        id="dueDate" 
                        type="date"
                        value={newFee.dueDate}
                        onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                        required 
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input 
                      id="description" 
                      value={newFee.description}
                      onChange={(e) => setNewFee({...newFee, description: e.target.value})}
                      placeholder="Additional details..."
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl">Cancel</Button>
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800 rounded-xl">Assign Fee</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
