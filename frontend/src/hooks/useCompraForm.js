import { useState } from "react";

const initialForm = {
nombre: "" , 
email: "" , 
metodo:"", 
tarjeta:"",
vencimiento:""

}

const initialErrors = 
{
nombre: "" , 
email: "" , 
metodo:"", 
tarjeta:"",
vencimiento:""

}

function validate (form) {
const errors = {...initialErrors}

if(!form.nombre.trim())
{
errors.nombre ="El nombre es requerido"

}

if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
{
    errors.email = "Ingresa un email valido"

}
if (!form.metodo)
{
    errors.metodo ="Ingresa un método de pago "

}
if(form.metodo === "tarjeta")
{
 if (!form.tarjeta.match(/^\d{16}$/))
 {
    errors.tarjeta ="La tarjeta debe contener 16 digítos"

 }
 if(!form.vencimiento.match(/^\d{2}\/\d{2}$/))
 {
    errors.vencimiento ="La fecha de vencimiento debe ser de formato MM/AA "

 }

}
return errors


}
function hasErrors (errors){
return Object.values(errors).some((error) => error !== "") //Revisamos que haya algun error

}
export function useCompraForm (onSuccess)
{
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  const setField = (key, value )  => 
  {
    setForm((prev) => ({...prev, [key]: value}))
    setErrors((prev)=> ({...prev, [key] : ""}))
  }

  const handleVencimiento = (raw) => //Formateamos el formato de la fecha de vencimiento 
  {
    let val = raw.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
    setField("vencimiento", val);

  }

  const handleSubmit = async () =>
  {
    const validationErrors = validate(form)
    if(hasErrors(validationErrors))
    {
        setErrors(validationErrors)
         return
    }
   setLoading(true)
   try { //Proceso de compra
    await new Promise((r) => setTimeout(r, 1200));
    setSuccess(true);
    onSuccess?.();
    } catch (err) {
    console.error(err);
    } finally {
    setLoading(false);
    }
  }

  const reset = () =>
  {
    setForm(initialForm);
    setErrors(initialErrors);
    setSuccess(false);
    setLoading(false);

  }

  return {
    form,
    errors,
    loading,
    success,
    setField,
    handleVencimiento,
    handleSubmit,
    reset,


  }

}