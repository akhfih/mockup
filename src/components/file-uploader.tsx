"use client"

import axios from "axios"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploaderProps {
    onUploadSuccess?: () => void;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [uploading, setUploading] = useState(false)

    // const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault()
    //     if (e.dataTransfer.files.length > 0) {
    //         setFile(e.dataTransfer.files[0])
    //     }
    // }

    const handleUpload = async () => {
        if (!file) return

        const formData = new FormData()
        formData.append("file", file) // sesuaikan key-nya jika FastAPI pakai nama lain

        setUploading(true)
        setProgress(0)

        try {
            await axios.post(`${API_BASE_URL}/upload-excel`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                    setProgress(percent)
                }
            })
            alert("Upload sukses!")

            // Call the callback to reload the table
            if (onUploadSuccess) {
                onUploadSuccess()
            }

            // Reset file input
            setFile(null)
        } catch (err) {
            alert("Upload gagal.")
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="p-6 border-2 border-dashed rounded-xl w-full max-w-ms mb-10 ">
            {/* <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="p-10 border rounded-xl text-center cursor-pointer bg-muted"
            >
                {file ? <p>{file.name}</p> : <p>Tarik file ke sini atau pilih manual</p>}
            </div> */}


            <div className="flex items-center justify-center gap-2">
                <div className="w-64">
                    <label htmlFor="file-upload" className="block text-sm font-medium mb-1">Pilih file Excel</label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="file-input file-input-bordered w-full"
                    />
                    {file && <div className="mt-1 text-xs text-gray-400">{file.name}</div>}
                </div>
                <Button onClick={handleUpload} disabled={!file || uploading} className="text-white bg-[#164396] h-10 mt-6">
                    {uploading ? "Mengunggah..." : "Upload"}
                </Button>
            </div>

            {uploading && (
                <div className="mt-4">
                    <Progress value={progress} />
                    <p className="text-center text-sm mt-2">{progress}%</p>
                </div>
            )}
        </div>
    )
}
