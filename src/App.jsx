import { useState } from "react";
import "./index.css";
import "./App.css";

function App() {
  const [friends, setFriend] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("");

  function addFriend(e) {
    e.preventDefault();
    const friendName = e.target[0].value;
    const names = friendName.split(" ");
    const firstName = names[0];
    const lastName = names.length > 1 ? names[1] : "";
    let friendImage = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;
    const newFriendObj = {
      name: friendName,
      url: friendImage,
      balance: 0,
    };
    e.target[0].value = "";

    setFriend([...friends, newFriendObj]);
  }

  function processBalance(e) {
    e.preventDefault();

    const billValue = parseFloat(e.target[0].value);
    const userExpense = parseFloat(e.target[1].value);
    const friendExpense = parseFloat(e.target[2].value);
    const billPayer = e.target[3].value;
    const friendIndex = friends.findIndex(
      (friend) => friend.name === selectedFriend
    );

    if (friendIndex !== -1) {
      const updatedFriends = [...friends];
      if (billPayer === "You") {
        updatedFriends[friendIndex].balance += friendExpense;
      } else {
        updatedFriends[friendIndex].balance -= userExpense;
      }
      setFriend(updatedFriends);
    }
  }

  function selectFriend(e) {
    setSelectedFriend(e.target.value);
  }

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <FriendList
        onAddFriend={addFriend}
        friends={friends}
        handleSelectFriend={selectFriend}
      />
      <ValueCalculator
        processBalance={processBalance}
        selectedFriend={selectedFriend}
      />
    </div>
  );
}

function FriendList({ onAddFriend, friends, handleSelectFriend }) {
  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded shadow">
      <div className="text-lg font-bold mb-2">FriendList</div>
      {friends.length > 0 &&
        friends.map((friend) => {
          return (
            <Friend
              name={friend.name}
              url={friend.url}
              balance={friend.balance}
              handleSelectFriend={handleSelectFriend}
            />
          );
        })}

      <AddFriends onAddFriend={onAddFriend} />
    </div>
  );
}

function Friend({ name, url, balance, handleSelectFriend }) {
  return (
    <div className="p-2 border-b border-gray-200 last:border-b-0">
      <h1 className="font-semibold">{name}</h1>
      <img src={url} alt={name} />
      <div>
        {balance > 0
          ? `${name} owes you $${balance}`
          : `You owe $${-balance} to ${name}`}
      </div>
      <button
        onClick={handleSelectFriend}
        value={name}
        className="mt-2 bg-blue-500 text-white py-1
px-3 rounded hover:bg-blue-600 transition-colors"
      >
        Select
      </button>
    </div>
  );
}

function AddFriends({ onAddFriend }) {
  return (
    <div className="mt-4">
      <form onSubmit={onAddFriend} className="flex gap-2">
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
          Add Friend
        </button>
      </form>
    </div>
  );
}

function ValueCalculator({ processBalance, selectedFriend }) {
  const [updatedValue, setUpdatedValue] = useState([0, 0, 0]);

  function handleBillChange(e) {
    const billValue = parseFloat(e.target.value);
    const splitValue = billValue / 2;
    setUpdatedValue([billValue, splitValue, splitValue]);
  }

  function handleUserExpenseChange(e) {
    const userExpense = parseFloat(e.target.value);
    const billValue = updatedValue[0];
    const friendExpense = billValue - userExpense;
    setUpdatedValue([billValue, userExpense, friendExpense]);
  }

  function handleFriendExpenseChange(e) {
    const friendExpense = parseFloat(e.target.value);
    const billValue = updatedValue[0];
    const userExpense = billValue - friendExpense;
    setUpdatedValue([billValue, userExpense, friendExpense]);
  }

  return (
    <div className="p-4 border border-gray-200 rounded shadow">
      {selectedFriend && (
        <form className="flex flex-col gap-4" onSubmit={processBalance}>
          <label>Bill Value</label>
          <input
            type="number"
            className="border border-[black]"
            value={updatedValue[0]}
            onChange={handleBillChange}
          />
          <label>Your Expense</label>
          <input
            type="number"
            className="border border-[black]"
            value={updatedValue[1]}
            onChange={handleUserExpenseChange}
          />
          <label>{selectedFriend}'s Expense</label>
          <input
            type="number"
            className="border border-[black]"
            value={updatedValue[2]}
            onChange={handleFriendExpenseChange}
          />
          <label>Who is paying the bill?</label>
          <select>
            <option>You</option>
            <option>{selectedFriend}</option>
          </select>
          <button className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
            Calculate
          </button>
        </form>
      )}
      {!selectedFriend && (
        <div className="text-lg font-bold mb-2">
          Select a friend to calculate
        </div>
      )}
    </div>
  );
}

export default App;
