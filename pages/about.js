import { useState, useEffect } from "react";

export default function About() {
  let changed = false;
  const [color, setColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("");

  useEffect(() => {
    setBackgroundColor(randomColor().toLowerCase());
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = color;
    console.log(color);
    console.log(backgroundColor);
    if (color.toLowerCase() === backgroundColor) {
      alert("恭喜調色成功神之眼就是你!!!!");
    }
  }, [color]); // 這個 useEffect 會在 color 更新後執行

  const randomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // const handleChange = (e) => {
  //   setColor(e.target.value);
  //   document.body.style.backgroundColor = e.target.value;
  //   console.log(e.target.value);
  //   console.log(backgroundColor);
  //   if (e.target.value == backgroundColor) {
  //     alert("恭喜調色成功神之眼就是你!!!!");
  //   }
  // };

  const handleChange = (e) => {
    setColor(e.target.value);
  };
  return (
    <main className="mx-auto  container mx-auto flex justify-center border-8">
      <div>
        <div className="w-100 card bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://www.color-meanings.com/wp-content/uploads/abstract-raccoon-portrait-painting-multicolored-tones.jpeg"
              alt="color racoon"
            />
          </figure>
          <div></div>
        </div>

        <div>
          <input type="color" value={color} onChange={handleChange} />
        </div>
        <div
          className="w-30 h-24"
          style={{ backgroundColor: backgroundColor }}
        ></div>
      </div>
    </main>
  );
}
