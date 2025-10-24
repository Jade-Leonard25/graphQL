import * as dropdown from '../../components/ui/dropdown-menu'

function Navbar() {
    const navbar_functions = [
        { name: 'File', functions: ['New Csv', 'Open Csv', 'Save Csv', 'Exit'] },
        { name: 'View', functions: [] },
        { name: 'Help', functions: [] },
        { name: 'About', functions: [] },
    ]

    return (
        <div className="flex items-center justify-between mx-auto p-2 shadow-md bg-gradient-to-br from-zinc-100 via-gray-200 to-slate-200 text-sm text-zinc-100 dark:text-zinc-100">
            <div className="inline-flex gap-4">
                {navbar_functions.map((x, i) => (
                    // Use key on the outermost repeating element
                    <dropdown.DropdownMenu key={i}>
                        {/* Use asChild for the trigger to correctly attach behavior to the <a> tag */}
                        <dropdown.DropdownMenuTrigger asChild>
                            <a
                                className="hover:bg-zinc-200 p-2 rounded hover:text-black transition duration-500 text-black"
                            >
                                {x.name}
                            </a>
                        </dropdown.DropdownMenuTrigger>



                        {Array.isArray(x.functions) && x.functions.length > 0 && (
                            <dropdown.DropdownMenuContent>
                                {x.functions.map((funcName, j) => (

                                    <dropdown.DropdownMenuItem key={j}>
                                        {funcName}
                                    </dropdown.DropdownMenuItem>
                                ))}
                            </dropdown.DropdownMenuContent>
                        )}
                    </dropdown.DropdownMenu>
                ))}
            </div>
            <div>
                <p className="text-2xl font-bold text-black dark:text-zinc-100">Csv Build</p>
            </div>
        </div>
    )
}

export default Navbar