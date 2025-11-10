/* -----------------------------------------------------------------
File: frontend/src/pages/About.jsx
Purpose: Simple about page template
----------------------------------------------------------------- */
import React from 'react'


export default function About(){
return (
<section className="py-12">
<div className="container">
<h1 className="text-2xl font-heading text-cognifer_blue">About Cognifer</h1>
<p className="mt-4 text-gray-700">Cognifer was created to make intelligent, data-driven decision tools accessible and explainable for organizations across Africa.</p>


<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="p-4 bg-white rounded shadow-sm">
<h3 className="font-semibold">Our Mission</h3>
<p className="text-gray-600 mt-2">To empower businesses and institutions with actionable intelligence.</p>
</div>
<div className="p-4 bg-white rounded shadow-sm">
<h3 className="font-semibold">Values</h3>
<p className="text-gray-600 mt-2">Integrity · Innovation · Impact</p>
</div>
<div className="p-4 bg-white rounded shadow-sm">
<h3 className="font-semibold">Contact</h3>
<p className="text-gray-600 mt-2">hello@cognifer.example</p>
</div>
</div>
</div>
</section>
)
}