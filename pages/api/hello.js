// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const colors = [
    "#123455",
    "#abcdef",
    "#fedcba",
    "#001122",
    "#334455",
    "#778899",
    "#aabbcc",
    "#123abc",
    "#987654",
    "#654321",
  ]; // 隨機選擇一個顏色
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // 返回選擇的顏色
  res.status(200).json({ color: randomColor });
}
