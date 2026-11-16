
import { useState } from "react";

function App() {
    const [img, setImg] = useState<File | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!img) return;
        console.log(img)
        const formdata = new FormData();

        formdata.set("hero", img);

        const response = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formdata
        });

        const data = await response.json();

        console.log(data);
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div>UPLOAD YOUR IMAGE</div>

            <form
                onSubmit={handleSubmit}
                className="w-full flex-col flex gap-1 items-center justify-center"
            >
                <input
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImg(file);
                    }}
                    type="file"
                    accept="image/*"
                    name="hero"
                />

                <input type="submit" value="submit" />
            </form>
        </div>
    );
}

export default App;
