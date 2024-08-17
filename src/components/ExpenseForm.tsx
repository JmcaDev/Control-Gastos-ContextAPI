//Dependencias
import DatePicker from 'react-date-picker';
import "react-calendar/dist/Calendar.css"
import "react-date-picker/dist/DatePicker.css"

//DB
import { categories } from "../data/cateogries"

//Type
import type { DraftExpense, Value } from "../types";

import { useEffect, useState } from "react";
import ErrorMessage from './ErrorMessage';

import { useBudget } from '../hooks/useBudget';

function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: "",
        category: "",
        date: new Date()
    })

    const [error, setError] = useState("")

    const [previusAmount, setPreviusAmount] = useState(0)

    const { dispatch, state, remainingBudget } =useBudget()

    useEffect(() =>{
        if(state.editingId){
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviusAmount(editingExpense.amount)
        }
    }, [state.editingId, state.expenses])

    const handleChange = (e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target
        const isAmountField = ["amount"].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //Validar
        if(Object.values(expense).includes("")){
            setError("Todos los campos son obligatorios")
            return
        }

        //Validar que no se pase del limite
        if((expense.amount - previusAmount) > remainingBudget){
            setError("Ese gasto excede el presupuesto")
            return
        }

        //Agregar o actualizar gasto
        if(state.editingId){
            dispatch({type :"update-expense", payload: {expense: { id: state.editingId, ...expense }}})
        }else{
            dispatch({type: "add-expense", payload: {expense}})
        }

        //reiniciar state
        setExpense({
            amount: 0,
            expenseName: "",
            category: "",
            date: new Date()
        })

        setPreviusAmount(0)
    }

  return (
    <form action="" className="space-y-5" onSubmit={handleSubmit}>
        <legend
            className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"
        >{state.editingId ? "Guardar Cambios" : "Nuevo Gasto"}</legend>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label 
                htmlFor="expenseName"
                className="text-xl"
            >Nombre del Gasto: </label>

            <input 
                type="text" 
                id="expenseName"
                placeholder="Añade el Nombre del gasto"
                className="bg-slate-100 p-2"
                name="expenseName"
                value={(expense.expenseName)}
                onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label 
                htmlFor="amount"
                className="text-xl"
            >Cantidad: </label>

            <input 
                type="number" 
                id="amount"
                placeholder="Añade la cantidad del gasto ej. 300"
                className="bg-slate-100 p-2"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label 
                htmlFor="category"
                className="text-xl"
            >Categoria: </label>

            <select 
                name="category" 
                id="category"
                className="bg-slate-100 p-2"
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">-- Seleccione --</option>
                {categories.map( category => (
                    <option
                        key={category.id}
                        value={category.id}
                    >{category.name}</option>
                ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label 
                htmlFor="expenseName"
                className="text-xl"
            >Fecha del Gasto: </label>
            <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>

        <input 
            type="submit" 
            className="bg-blue-600 cursor-pointer w-full text-white uppercase p-2 font-bold rounded-lg"
            value={state.editingId ? "Guardar Cambios" : "Registrar Gasto"}
        />
    </form>
  )
}

export default ExpenseForm