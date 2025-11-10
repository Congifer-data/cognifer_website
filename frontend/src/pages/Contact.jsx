/* -----------------------------------------------------------------
File: frontend/src/pages/Contact.jsx
Purpose: Simple contact form that posts to backend contact endpoint
----------------------------------------------------------------- */
import React, { useState } from 'react'
import axios from 'axios'


export default function Contact(){
const [form, setForm] = useState({name:'', email:'', org:'', message:''})
const [status, setStatus] = useState(null)


async function submit(e){
e.preventDefault()
setStatus('sending')
try{
// send to backend /api/contact (not yet implemented) - placeholder
// await axios.post('/api/contact', form)
setStatus('sent')
}catch(err){
setStatus('error')
}
}


return (
<section className="py-12">
<div className="container max-w-2xl">
<h1 className="text-2xl font-heading text-cognifer_blue">Contact Us</h1>
<p className="text-gray-600 mt-2">Request a demo or ask a question — we’ll respond within 2 business days.</p>


<form className="mt-6 bg-white p-6 rounded shadow-sm" onSubmit={submit}>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<input required placeholder="Your name" className="p-2 border rounded" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
<input required type="email" placeholder="Email" className="p-2 border rounded" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
</div>
<input placeholder="Organization" className="mt-4 p-2 border rounded w-full" value={form.org} onChange={e=>setForm({...form, org:e.target.value})} />
<textarea required placeholder="Message" className="mt-4 p-2 border rounded w-full" rows="5" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
<div className="mt-4">
<button className="px-4 py-2 rounded bg-cognifer_sky text-white">Send</button>
{status === 'sending' && <span className="ml-3 text-sm text-gray-500">Sending...</span>}
{status === 'sent' && <span className="ml-3 text-sm text-green-600">Sent. Thanks!</span>}
{status === 'error' && <span className="ml-3 text-sm text-red-600">Failed. Try again.</span>}
</div>
</form>
</div>
</section>
)
}