
import React, { useState, useCallback } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Search, Download, Upload, FileText, Settings, Sparkles } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";

const vendorData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 600 },
  { name: "Mar", value: 300 },
  { name: "Apr", value: 700 },
  { name: "May", value: 600 },
  { name: "Jun", value: 400 },
  { name: "Jul", value: 500 },
  { name: "Aug", value: 600 },
  { name: "Sep", value: 800 },
  { name: "Oct", value: 650 },
  { name: "Nov", value: 550 },
  { name: "Dec", value: 400 },
];

export default function DashboardContent() {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    toast({
      title: "Arquivo carregado com sucesso",
      description: `${acceptedFiles.length} arquivo(s) adicionado(s).`,
    });
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome Back</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vendor Statistics */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">Vendor Statistics</CardTitle>
              <CardDescription>Your employee performance level</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-full border-8 border-purple-500/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl font-bold">72.2%</div>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <h4 className="font-medium">You almost reached your limit!</h4>
                <p className="text-sm text-muted-foreground">You've nearly used 72% of your free space.</p>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">19.2%</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  <ArrowUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />
                  <span className="text-red-500">7.2%</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze with AI
            </Button>
          </CardContent>
        </Card>

        {/* Vendor Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Vendor Breakdown</CardTitle>
                <CardDescription>Here you can track your vendor's performance everyday.</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs">1 day</Button>
                <Button variant="outline" size="sm" className="text-xs">1 week</Button>
                <Button variant="outline" size="sm" className="text-xs">1 month</Button>
                <Button variant="outline" size="sm" className="text-xs">1 year</Button>
                <Button variant="outline" size="sm" className="text-xs">All Time</Button>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <span>View Full Report</span>
                <Download className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Drag and drop your documents here for quick upload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the files here" : "Drag & drop files here"}
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse files
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Uploaded Files</h3>
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-purple-900 text-white">
          <CardHeader>
            <CardTitle>Comprehensive Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Explore detailed historical statistics to identify long-term trends and patterns.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-900 text-white">
          <CardHeader>
            <CardTitle>Customizable Dashboards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Create personalized dashboards to focus on the metrics and KPIs that matter most.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-900 text-white">
          <CardHeader>
            <CardTitle>Automated Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">
              Generate detailed reports automatically, ensuring accuracy and saving valuable time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
