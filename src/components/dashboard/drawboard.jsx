import { Input } from "../ui/input"
import { useState, useEffect, useRef, useMemo } from "react"
import Papa from 'papaparse';
import * as d3 from 'd3'; // 👈 Import all of D3
import * as card from '../ui/card'
// --- Configuration ---
const WIDTH = 1000;  // Increased to accommodate more columns
const HEIGHT = 650;   // Increased for better visibility
/**
 * Renders the circle/node visualization.
 * It combines the Papa Parse file uploader with a D3 Force-Directed Graph.
 */
const DrawBoard = () => {
    // State for the raw parsed data (array of objects from CSV)
    const [csvData, setCsvData] = useState([]);
    // State for the D3-compatible graph data (nodes and links)
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [fileName, setFileName] = useState('');
    
    // Ref for the SVG element, allowing D3 to access the DOM
    const svgRef = useRef(null);

    // ================= 1. Papa Parse Logic =================
    
    const parseCsvToGraphData = (data) => {
        if (!data || data.length === 0) return { nodes: [], links: [] };

        const nodes = [];
        const links = [];
        const columns = Object.keys(data[0]);

        // For each row in the CSV
        data.forEach((row, rowIndex) => {
            // Create a node for each column value in the row
            const rowNodes = columns.map(column => ({
                id: `${column}-${rowIndex}`,
                name: String(row[column] || ''),
                type: column,
                originalValue: row[column]
            }));

            nodes.push(...rowNodes);

            // Create links between consecutive columns
            for (let i = 0; i < rowNodes.length - 1; i++) {
                links.push({
                    source: rowNodes[i].id,
                    target: rowNodes[i + 1].id,
                    value: 1
                });
            }
        });

        return { nodes, links };
    };
    
    // Handler for the file input
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        
        if (file && file.type === 'text/csv') {
            setFileName(file.name);
            
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: function (results) {
                    // Raw data is received
                    setCsvData(results.data);
                    
                    // Convert raw CSV data into a D3-friendly nodes/links structure
                    const newGraphData = parseCsvToGraphData(results.data);
                    setGraphData(newGraphData);
                },
                error: function(error) {
                    console.error("Papa Parse Error:", error);
                    setCsvData([]);
                    setGraphData({ nodes: [], links: [] });
                    setFileName('');
                }
            });
        } else {
            setFileName('');
            setCsvData([]);
            setGraphData({ nodes: [], links: [] });
            alert('Please upload a valid CSV file (.csv).');
        }
    };
    
    // ================= 2. D3 Force Graph Logic =================
    
    useEffect(() => {
        // Only run if we have nodes to draw and SVG is ready
        if (graphData.nodes.length === 0 || !svgRef.current) return;

        // Get the SVG element
        const svg = d3.select(svgRef.current);
        
        // Safety check
        if (!svg.node()) return;

        // Setup zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                zoomGroup.attr("transform", event.transform);
            });

        // Apply zoom to SVG
        svg.call(zoom);

        // Create or select zoom container
        const zoomGroup = svg.select(".zoom-layer");
        
        // Create the links
        const links = zoomGroup.select(".links")
            .selectAll("line")
            .data(graphData.links)
            .join("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 2);

        // Create the nodes
        const nodes = zoomGroup.select(".nodes")
            .selectAll(".node-group")
            .data(graphData.nodes)
            .join("g")
            .attr("class", "node-group");

        // Add circles to nodes
        nodes.selectAll("circle")
            .data(d => [d])
            .join("circle")
            .attr("r", 10)
            .attr("fill", d => color(d.type))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .style("cursor", "grab");

        // Add text labels to nodes
        nodes.selectAll("text")
            .data(d => [d])
            .join("text")
            .attr("x", 12)
            .attr("y", 3)
            .attr("font-size", "10px")
            .attr("fill", "#333")
            .style("pointer-events", "none")
            .text(d => d.name);

        // Initialize the D3 Simulation with a copy of the nodes
        const simulation = d3.forceSimulation(graphData.nodes)
            .force("link", d3.forceLink(graphData.links)
                .id(d => d.id)
                .distance(100))
            .force("charge", d3.forceManyBody()
                .strength(-300))
            .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            .force("x", d3.forceX(WIDTH / 2).strength(0.1))
            .force("y", d3.forceY(HEIGHT / 2).strength(0.1));

        // Define drag behavior
        const drag = d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        // Apply drag behavior to nodes
        svg.selectAll(".node-group")
           .data(graphData.nodes)
           .call(drag);

        // This function updates the coordinates of the links and nodes
        const ticked = () => {
            // Update lines
            svg.selectAll("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            // Update node groups
            svg.selectAll(".node-group")
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        };

        simulation.on("tick", ticked);
        
        // Clean up the simulation when the component unmounts or data changes
        return () => {
            simulation.stop();
            svg.selectAll("*").remove();
        };
        
    }, [graphData.nodes.length]); // Re-run effect when the number of nodes changes

    // Set up zoom behavior
    const handleZoom = (event) => {
        const { transform } = event;
        if (svgRef.current) {
            d3.select(svgRef.current)
                .select(".zoom-layer")
                .attr("transform", transform);
        }
    };

    // Set up a color scale based on column types
    const color = useMemo(() => {
        if (csvData.length === 0) return d3.scaleOrdinal(d3.schemeCategory10);
        const columns = Object.keys(csvData[0]);
        return d3.scaleOrdinal(d3.schemeCategory10).domain(columns);
    }, [csvData]);
    
    // ================= 3. React Rendering =================
    
    return (
        <div style={{ padding: '20px' }}>
            <h2>CSV Uploader & Network Graph</h2>
            
            {/* File Input Component */}
            <Input 
                placeholder='Upload CSV with columns: name, age, city'
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
            />
            {fileName && (
                <p>File loaded: **{fileName}** (Parsed **{csvData.length}** rows)</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                    {/* SVG Visualization */}
      {graphData.nodes.length > 0 && (
 <card.Card
  className="mb-4 py-2 px-2 rounded-xl 
    bg-gradient-to-r from-zinc-900 to-slate-900
      transition duration-900"
>
    <div>
  <card.Card className="h-auto">
    <card.CardContent className='text-zinc-200'>
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        className="w-full h-full bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900"
        style={{ cursor: "grab" }}
        
      >
        <g className="zoom-layer">
          <g className="links"></g>
          <g className="nodes"></g>
        </g>
      </svg>
    </card.CardContent>
  </card.Card>
  </div>
</card.Card>


)}

            
         
                </div>
                <div>
                       {/* Dynamic Legend */}
        
{csvData.length > 0 && (
    <div className="text-sm p-4 rounded-lg bg-zinc-50 shadow-inner border border-zinc-200">
        
        {/* Legend Title */}
        <strong className="block mb-3 text-zinc-700 border-b border-zinc-200 pb-2 font-semibold uppercase tracking-wider">
            Columns Legend
        </strong> 
        
        {/* Simplified Grid Container */}
        {/* Using GRID ensures that the items wrap naturally and consistently,
            and the gap utility works perfectly without any inline styles. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(csvData[0]).map((column) => (
                <span 
                    key={column} 
                    // No display property needed (it defaults to inline, or we use grid's flow)
                    // Use 'flex' here ONLY to align the bullet and text inside the span
                    className="flex items-center gap-1 font-medium" 
                    style={{ color: color(column) }}
                >
                    <span className="text-xl leading-none">●</span>
                    <span className="text-zinc-800">{column}</span>
                </span>
            ))}
        </div>
    </div>
)}
                </div>
            </div>
        </div>
    )
}

export default DrawBoard