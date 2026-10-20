export default function GroupButton({placement,children='Quero participar',onRegister}:{placement:string;children?:React.ReactNode;onRegister:(placement:string)=>void}) {
  return <button className="button" type="button" onClick={()=>onRegister(placement)} aria-haspopup="dialog">{children}<span aria-hidden="true">→</span></button>;
}
