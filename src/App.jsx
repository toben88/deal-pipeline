import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const STATUSES = ['Reviewing', 'LOI Submitted', 'Due Diligence', 'Negotiating', 'Passed', 'Closed']

function App() {
  const [deals, setDeals] = useState([])
  const [filteredDeals, setFilteredDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'card'
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [formData, setFormData] = useState({
    business_name: '',
    asking_price: '',
    sde: '',
    industry: '',
    status: 'Reviewing',
    location: '',
    notes: ''
  })

  useEffect(() => {
    fetchDeals()
  }, [])

  useEffect(() => {
    filterAndSortDeals()
  }, [deals, filterStatus, sortBy, sortOrder])

  async function fetchDeals() {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setDeals(data || [])
    } catch (error) {
      console.error('Error fetching deals:', error.message)
    } finally {
      setLoading(false)
    }
  }

  function filterAndSortDeals() {
    let filtered = [...deals]
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(deal => deal.status === filterStatus)
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'asking_price' || sortBy === 'sde') {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    
    setFilteredDeals(filtered)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    try {
      if (editingDeal) {
        const { error } = await supabase
          .from('deals')
          .update({
            ...formData,
            asking_price: parseFloat(formData.asking_price),
            sde: parseFloat(formData.sde),
            updated_at: new Date().toISOString()
          })
          .eq('id', editingDeal.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('deals')
          .insert([{
            ...formData,
            asking_price: parseFloat(formData.asking_price),
            sde: parseFloat(formData.sde)
          }])
        
        if (error) throw error
      }
      
      await fetchDeals()
      resetForm()
    } catch (error) {
      console.error('Error saving deal:', error.message)
      alert('Error saving deal: ' + error.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this deal?')) return
    
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      await fetchDeals()
    } catch (error) {
      console.error('Error deleting deal:', error.message)
    }
  }

  function handleEdit(deal) {
    setEditingDeal(deal)
    setFormData({
      business_name: deal.business_name,
      asking_price: deal.asking_price.toString(),
      sde: deal.sde.toString(),
      industry: deal.industry,
      status: deal.status,
      location: deal.location,
      notes: deal.notes || ''
    })
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      business_name: '',
      asking_price: '',
      sde: '',
      industry: '',
      status: 'Reviewing',
      location: '',
      notes: ''
    })
    setEditingDeal(null)
    setShowForm(false)
  }

  function calculateStats() {
    const total = deals.length
    const avgPrice = deals.length > 0 
      ? deals.reduce((sum, d) => sum + d.asking_price, 0) / deals.length 
      : 0
    const statusCounts = {}
    STATUSES.forEach(status => {
      statusCounts[status] = deals.filter(d => d.status === status).length
    })
    return { total, avgPrice, statusCounts }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  function calculateMultiple(price, sde) {
    if (!sde || sde === 0) return 'N/A'
    return (price / sde).toFixed(2) + 'x'
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading deals...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Deal Pipeline Tracker</h1>
          <p className="text-gray-600 mt-2">Track and manage acquisition opportunities</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Deals</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Avg Asking Price</div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgPrice)}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Active Deals</div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.statusCounts['LOI Submitted'] + stats.statusCounts['Due Diligence'] + stats.statusCounts['Negotiating']}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Closed</div>
            <div className="text-2xl font-bold text-green-600">{stats.statusCounts['Closed']}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Date Added</option>
                <option value="business_name">Business Name</option>
                <option value="asking_price">Asking Price</option>
                <option value="sde">SDE</option>
                <option value="status">Status</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>

            <div className="flex gap-4">
              {/* View Toggle */}
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded ${viewMode === 'table' ? 'bg-white shadow' : ''}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-4 py-2 rounded ${viewMode === 'card' ? 'bg-white shadow' : ''}`}
                >
                  Cards
                </button>
              </div>

              {/* Add Deal Button */}
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                + Add Deal
              </button>
            </div>
          </div>
        </div>

        {/* Deal Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.business_name}
                        onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asking Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.asking_price}
                        onChange={(e) => setFormData({...formData, asking_price: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SDE ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.sde}
                        onChange={(e) => setFormData({...formData, sde: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        rows="4"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingDeal ? 'Update Deal' : 'Add Deal'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asking Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SDE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Multiple
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{deal.business_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(deal.asking_price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(deal.sde)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{calculateMultiple(deal.asking_price, deal.sde)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deal.industry}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deal.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${deal.status === 'Closed' ? 'bg-green-100 text-green-800' :
                            deal.status === 'Passed' ? 'bg-red-100 text-red-800' :
                            deal.status === 'Due Diligence' ? 'bg-blue-100 text-blue-800' :
                            deal.status === 'Negotiating' ? 'bg-purple-100 text-purple-800' :
                            deal.status === 'LOI Submitted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {deal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(deal)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(deal.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDeals.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No deals found. Add your first deal to get started.
              </div>
            )}
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{deal.business_name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${deal.status === 'Closed' ? 'bg-green-100 text-green-800' :
                      deal.status === 'Passed' ? 'bg-red-100 text-red-800' :
                      deal.status === 'Due Diligence' ? 'bg-blue-100 text-blue-800' :
                      deal.status === 'Negotiating' ? 'bg-purple-100 text-purple-800' :
                      deal.status === 'LOI Submitted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {deal.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Asking Price:</span>
                    <span className="text-sm font-semibold">{formatCurrency(deal.asking_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">SDE:</span>
                    <span className="text-sm font-semibold">{formatCurrency(deal.sde)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Multiple:</span>
                    <span className="text-sm font-semibold">{calculateMultiple(deal.asking_price, deal.sde)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Industry:</span>
                    <span className="text-sm">{deal.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm">{deal.location}</span>
                  </div>
                </div>
                
                {deal.notes && (
                  <div className="mb-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 line-clamp-3">{deal.notes}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(deal)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredDeals.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No deals found. Add your first deal to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
