import React from "react";

export default function Impressum(){
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Impressum</h1>
      <p>Johannes Hagl</p>
      <p>Wehrgasse 7<br/>3441 Judenau<br/>Österreich</p>
      <p>
        E-Mail:{" "}
        <a href="mailto:johanneshagl7@gmail.com" className="text-blue-600">
          johanneshagl7@gmail.com
        </a>
      </p>
    </div>
  );
}
