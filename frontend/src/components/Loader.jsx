/* -----------------------------------------------------------------
File: frontend/src/components/Loader.jsx
Purpose: Simple loading placeholder used during lazy loading
----------------------------------------------------------------- */
import React from 'react'


export default function Loader(){
return (
<div className="min-h-[40vh] flex items-center justify-center">
<div className="animate-pulse text-cognifer_blue">Loading...</div>
</div>
)
}