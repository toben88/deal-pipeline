import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function TestConnection() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState({})

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    const results = {
      url: import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
      keySet: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'YES (hidden)' : 'NOT SET',
    }

    // Test 1: Check if URL and key are set
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setStatus('ERROR: Missing environment variables')
      setDetails(results)
      return
    }

    // Test 2: Try to query the deals table
    try {
      const { data, error } = await supabase.from('deals').select('*').limit(5)

      if (error) {
        results.dbError = error.message
        results.errorCode = error.code
        results.errorHint = error.hint || 'No hint'
        setStatus('ERROR: Database query failed')
      } else {
        results.dbConnection = 'SUCCESS'
        results.rowCount = data ? data.length : 0
        results.sampleData = data && data.length > 0 ? data[0].business_name : 'No data yet'
        setStatus('SUCCESS: Connected to Supabase!')
      }
    } catch (err) {
      results.exception = err.message
      setStatus('ERROR: Exception thrown')
    }

    setDetails(results)
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Supabase Connection Test</h1>

      <div style={{
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: status.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
        border: `2px solid ${status.includes('SUCCESS') ? '#28a745' : '#dc3545'}`,
        borderRadius: '8px'
      }}>
        <strong>Status:</strong> {status}
      </div>

      <h2>Details:</h2>
      <pre style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        overflow: 'auto'
      }}>
        {JSON.stringify(details, null, 2)}
      </pre>

      <button
        onClick={testConnection}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Again
      </button>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>Troubleshooting:</h3>
        <ul>
          <li><strong>Missing env vars?</strong> Check your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
          <li><strong>Table not found?</strong> Run the SQL from supabase-setup.sql in Supabase SQL Editor</li>
          <li><strong>Permission denied?</strong> Check Row Level Security policies in Supabase</li>
          <li><strong>Invalid API key?</strong> Make sure you're using the "anon public" key, not secret key</li>
        </ul>
      </div>
    </div>
  )
}

export default TestConnection
