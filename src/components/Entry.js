import React from "react";

const Entry = ({ entry, toggleImportance }) => {
  const label = entry.important ? "make not important" : "make important";

  return (
    <li className="note">
      {entry.name}
      {entry.number}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Entry;
