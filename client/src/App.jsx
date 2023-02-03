import { useState, useEffect } from "react";
import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadingIcon from "./assets/loader.svg";
import bot from "./assets/bot.png";
import axios from "axios";
import { FileUploader } from "react-drag-drop-files";
import Tesseract from "tesseract.js";

function App() {
  const fileTypes = ["JPG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
  const [input, setInput] = useState("");
  const [posts, setPost] = useState([]);

  const handleChange = (file) => {
    setFile(file);
  };

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "https://first-0tjf.onrender.com",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };

  const onSubmits = () => {
    if (input.trim() === "") {
      return;
    }
    updatePost(input);
    updatePost("Loading", false, true);
    fetchBotResponse().then((res) => {
      updatePost(res.bot.trim(), true);
      console.log(res);
    });
    setInput("");
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPost((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const updatePost = (post, isBot, isLoading) => {
    if (isBot) {
      console.log(post);
      autoTypingBotResponse(post);
    } else {
      setPost((PrevState) => {
        return [
          ...PrevState,
          { type: isLoading ? "loading" : "user", post: post },
        ];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      onSubmits();
    }
  };

  return (
    <>
      <main className="chatGPT-app">
        <section className="chat-container">
          <div className="layout">
            {posts.map((post, index) => {
              return (
                <>
                  <div
                    key={index}
                    className={`chat-bubble ${
                      post.type === "bot" || post.type === "loading"
                        ? "bot"
                        : " "
                    }`}
                  >
                    <div className="avatar">
                      <img
                        src={
                          post.type === "bot" || post.type === "loading"
                            ? bot
                            : user
                        }
                        alt="user"
                      />
                    </div>
                    {post.type === "loading" ? (
                      <div className="loader">
                        <img src={loadingIcon} alt="loading" />
                      </div>
                    ) : (
                      <div className="post">{post.post}</div>
                    )}
                  </div>
                </>
              );
            })}
          </div>
        </section>
        <footer>
          <div className="footer1">
            <div className="file">
              <div>
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={fileTypes}
                />
              </div>
              <div className="button1">
                <button
                  onClick={() => {
                    Tesseract.recognize(file, "eng", {
                      logger: (m) => console.log(m),
                    }).then(({ data: { text } }) => {
                      setInput(text);
                      console.log(text);
                    });
                  }}
                >
                  Convert
                </button>
              </div>
            </div>
            <div className="footer2">
              <input
                className="composebar"
                type="text"
                autoFocus
                placeholder="Ask Anythings!"
                value={input}
                onKeyUp={onKeyUp}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="send-button" onClick={onSubmits}>
                <img src={send} alt="send" />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
