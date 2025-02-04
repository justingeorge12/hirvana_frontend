
function CommonModal({onClose, func, message}) {


    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10">
            <div className="absolute bg-lime-50 border border-slate-600 shadow-md shadow-gray-700 rounded-lg p-6">
                <div className="border-slate-600 rounded-md py-4 ">
                    <h1 className="text-lg">Do you realy want to {message}</h1>
                    <div className="mx-6 mt-8 flex justify-between">
                        <button onClick={() => onClose()} className="border rounded-md border-slate-500 px-4 py-1 ">
                            No
                        </button>
                        <button onClick={() => func()} className="border border-red-500 px-4 py-1 rounded-md" >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommonModal