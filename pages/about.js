import { useState, useEffect } from "react";
import { socket } from "../socket.js"; // 確保你有引入並配置好 socket.io 客戶端

export default function About() {
  const [color, setColor] = useState("#ffffff"); // 初始白色
  const [playerName, setPlayerName] = useState("");
  const [blocks, setBlocks] = useState([]); // 存儲所有玩家的區塊
  const [backgroundColor, setBackgroundColor] = useState("");
  // React 组件中
  useEffect(() => {
    socket.on("newColor", (data) => {
      setBackgroundColor(data.color); // 更新背景颜色状态
      setColor(data.color); // 更新当前颜色状态，如果需要的话
    });

    return () => {
      socket.off("newColor");
    };
  }, []);

  const handleNewColorRequest = () => {
    socket.emit("requestNewColor"); // 向服务器请求新题目
  };
  useEffect(() => {
    const handleColorUpdate = (data) => {
      document.body.style.backgroundColor = data.color;
      setColor(data.color);
    };

    socket.on("updateColor", handleColorUpdate);

    return () => {
      socket.off("updateColor", handleColorUpdate);
    };
  }, []);

  useEffect(() => {
    socket.on("newBlock", (newBlock) => {
      setBlocks((prevBlocks) => {
        const updatedBlocks = [...prevBlocks, newBlock];
        console.log("Updated Blocks:", updatedBlocks);
        return updatedBlocks;
      });
    });

    return () => {
      socket.off("newBlock");
    };
  }, []);

  const handleSubmit = () => {
    const block = { playerName, color };
    alert("送出答案");
    socket.emit("syncBlock", block);
  };

  // 從 API 獲取顏色
  async function fetchColor() {
    const res = await fetch("/api/hello");
    const data = await res.json();
    setBackgroundColor(data.color.toLowerCase()); // 更新背景顏色
  }

  const handleChange = (e) => {
    setColor(e.target.value);
    socket.emit("syncColor", { color: e.target.value });
  };
  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const addBlock = (block) => {
    setBlocks((prev) => [...prev, block]);
  };

  return (
    <main
      className="mx-auto  border-8 bg-slate-300 py-10"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="">
        <h1 className="text-4xl">調色遊戲：這裡是目標顏色</h1>
        <p>
          點擊出題按鍵更新上方目標顏色，與你的好朋友比賽誰的顏色最接近目標顏色~~
        </p>
        <div>
          <label name="player">玩家名稱</label>
          <input
            type="text"
            id="player"
            value={playerName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label htmlFor="answer">選擇答案</label>
          <input
            id="answer"
            type="color"
            value={color}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleSubmit}
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          送出答案
        </button>
        <button
          onClick={handleNewColorRequest}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full "
        >
          出新題目
        </button>
      </div>
      <div className="flex justify-around">
        {blocks.map((block, index) => (
          <div
            key={index}
            style={{
              backgroundColor: block.color,
              width: "100px",
              height: "100px",
              margin: "10px",
            }}
          >
            <p>{block.playerName}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
