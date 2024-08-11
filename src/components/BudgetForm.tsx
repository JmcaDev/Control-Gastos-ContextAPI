import { useState } from "react"

function BudgetForm() {

    const [budget, setBudget] = useState(0)

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setBudget(+e.target.value)
    }

    return (
        <form action="" className="space-y-5">
            <div className="flex flex-col space-y-5">
                <label htmlFor="budget" className="text-4xl text-blue-600 text-center font-bold">
                    Definir Presupuesto
                </label>
                <input
                    id="budget"
                    type="number" 
                    className="w-full bg-white border border-gray-200 p-2"
                    placeholder="Define tu presupuesto"
                    name="budget"
                    value={budget}
                    onChange={handleChange}
                />
            </div>

            <input 
                type="submit" 
                value="Definir Presupuesto"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase"
            />
        </form>
    )
}

export default BudgetForm