import {Button} from '../components/ui/button';
import { Link } from 'react-router';
export const Hero =() =>{
    return(
        <div className="text-center items-center relative p-2 dark:text-zinc-100 mb-2 pt-20">
            <h1 className="text-5xl font-bold mb-2 text-zinc-200"><span className="bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">Graph-ify</span> Your Data. Instantly.</h1>
            <p className="text-2xl font-bold mb-2 text-zinc-200">From CSV to Clarity: The GraphQL Graph Database Builder.</p>

        <div className="inline-flex gap-4 pt-10">
            <Button variant={'default'}
                onClick={() =>{
                    window.location.href ='/dashboard'
                }}
            >
                Get Started
            </Button>
            <Button variant={'configuration'}onClick={() =>{
                window.location.href= '/drawboard'
            }}>
                Get a Demo Content
            </Button>
        </div>
        </div>
    )
}