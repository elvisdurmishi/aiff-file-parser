'use client'
import {useState} from "react";
import * as mm from 'music-metadata-browser';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const getAIFFDuration = async (file: File) => {
        try {
            const metadata = await mm.parseBlob(file);
            console.log("metadata", metadata);
            console.log("duration", metadata.format.duration)
            if (metadata.format.duration != null) {
                console.log("duration in seconds", `${Math.floor(metadata.format.duration)} seconds`)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleUpload = () => {
        try {
            if (file) {
                const reader = new FileReader();

                reader.onload = async (event) => {
                    if (event.target && event.target.result) {
                        // Create a Blob from the AIFF file content
                        const fileBlob = new Blob([event.target.result], {type: 'audio/aiff'});

                        // Create a new File object with the Blob and file name
                        const uploadedFile = new File([fileBlob], file.name, {type: 'audio/aiff'});

                        // Handle the File object as needed
                        console.log('Uploaded AIFF File:', uploadedFile);

                        await getAIFFDuration(uploadedFile);
                    }
                };
            } else {
                console.error('No file selected');
            }
        } catch (error) {
            console.error('Error handling file', error);
        }
    };

    return (
        <div>
            <h1>File Upload</h1>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
