import * as alert_dialog from "../components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { Input } from '../components/ui/input'
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router"

export function Header() {
    const [data, setData] = useState({ email: "", password: "" });
    const handleSubmit =(e) =>{
        e.preventDefault();
        console.log(data)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(item => ({
            ...item, [name]: value
        }))
    }
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-gradient-to-l  from-slate-900 via-cyan-900 to-slate-900 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xl shadow-slate-900 text-zinc-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                   <Link to={'/'}>
                     <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-accent to-secondary">
                            <span className="text-sm font-bold text-primary-foreground">N</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">Notion</span>
                    </div>
                   </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-zinc-100 hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#collaboration" className="text-sm text-zinc-100 hover:text-foreground transition-colors">
                            Collaboration
                        </a>
                        <a href="#testimonials" className="text-sm text-zinc-100 hover:text-foreground transition-colors">
                            Testimonials
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <alert_dialog.AlertDialog>
                            <alert_dialog.AlertDialogTrigger>
                                <Button variant="ghost" className="text-sm">
                                    Sign In
                                </Button>
                            </alert_dialog.AlertDialogTrigger>
                            <alert_dialog.AlertDialogContent className={'bg-gradient-to-br from-zinc-100 to-slate-200'}>
                                
                                <div className=" ">
                                    <p className="text-2xl fontbold p-2 mb-6">
                                        Welcome Back
                                    </p>
                                    <form className="mb-6" onSubmit={handleSubmit}>
                                        <Label for='email' className='mb-4'>Email</Label>
                                        <Input name='email' value={data.email} onChange={handleChange} placeholder='Email' type={'email'} className={'mb-4'} />
                                        <Label for='email' className='mb-4'>Password</Label>
                                        <Input name='password' value={data.password} onChange={handleChange} placeholder='Email' type={'password'} className={'mb-4'} />
                                        <div className="inline-flex gap-2">
                                            <Button variant='default'type='submit'>Submit</Button>
                                            <Button variant='secondary'>Sign up?</Button>
                                        </div>
                                    </form>
                                </div>
                                <alert_dialog.AlertDialogCancel className='absolute top-2 right-2'>
                                    <X />
                                </alert_dialog.AlertDialogCancel>
                            </alert_dialog.AlertDialogContent>
                        </alert_dialog.AlertDialog>
                        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
