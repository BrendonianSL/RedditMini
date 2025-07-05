import { useState, useEffect } from 'react';
import Post from '../components/Post';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../reduxStuff/themeSlice';
import { obtainToken } from '../ObtainToken';

function App() {

  //Subscribes To Current Theme State.
  const currentMode = useSelector((state) => state.theme.theme);
  const [rotate, setRotate] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [subreddits, setSubreddits] = useState(null);
  const [subredditInfo, setSubredditInfo] = useState({
    name: 'Popular',
    description: 'The Most Popular Subreddits On Reddit',
    header: '/defaultbanner.png',
  });
  let token = null;

  //Clean Variables For Calling
  const dispatch = useDispatch();

  //Function To Abbreviate Subscribers.
  const abbreviateSubscribers = (subscribers) => {
    if(subscribers > 1000000) {
      return (subscribers / 1000000).toFixed(1) + 'M';
    } else if(subscribers > 1000) {
      return (subscribers / 1000).toFixed(1) + 'K';
    } else {
      return subscribers;
    }
  }

  const fetchPost = async (subreddit) => {
    //Check If We Have Token. If Not, Fetch New Token.
    if(!token) {
      token = await obtainToken();
    }

    //Check If Subreddit Parameter Has A Value.
    if(!subreddit) {
      //Fetch 10 Popular Post On Reddit Sitewide.
    }

    //Fetch 10 Popular Post On Subreddit.
    const response = await fetch(`https://oauth.reddit.com/r/${subreddit}.json?limit=10`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    //Parse Response.
    const data = await response.json();

    //Update State.
    setCurrentPost(data.data.children);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  //Use Effect To Update Background Of HTML Element When Theme Changes
  useEffect(() => {
    const root = document.getElementById('root');

    if(currentMode === 'light') {
      root.classList.remove('bg-(--dm-bg-dark)');
      root.classList.add('bg-(--lm-bg-dark)')
    } else {
      root.classList.remove('bg-(--lm-bg-dark)');
      root.classList.add('bg-(--dm-bg-dark)')
    }
  }, [currentMode]);

  //On Load, Grab Data For The First 20 Popular Post On Reddit
  useEffect(() => {
    async function fetchPostData() {
      //If No Token, Get Token.
      if(!token) {
        token = await obtainToken();
      }

      //After Obtaining Token, Grab Data For The First 20 Popular Post On Reddit
      const response = await fetch('https://oauth.reddit.com/r/popular.json?limit=10', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      const data = await response.json();
      console.log(data.data.children);
      setCurrentPost(data.data.children);

      const response2 = await fetch('https://www.reddit.com/subreddits/popular.json?limit=10', {
      });

      const data2 = await response2.json();
      console.log(data2.data.children);
      setSubreddits(data2.data.children);
    }

    fetchPostData();
  }, []);

  return (
    <main id='top' className='flex flex-col '>
      <header className={`${currentMode == 'light' ? 'border-(--lm-bg)' : 'border-(--dm-bg)'} flex items-center justify-center py-4 border-b-1`}>
        <div className='flex justify-between items-center max-w-[64.5rem] w-full'>
            <img src={`${currentMode == 'light' ? '/breaddit.png' : '/breadditdark.png'}`} />
            <div className='flex gap-2'>
              <a href='https://github.com/BrendonianSL/RedditMini' target='_blank'>
                <svg className={`${currentMode === 'light' ? 'fill-(--lm-text) stroke-(--lm-bg-dark)' : 'fill-(--dm-text) stroke-(--dm-bg-dark)'}`} width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 2.5C13.8585 2.5 12.233 2.82332 10.7165 3.45151C9.19989 4.07969 7.8219 5.00043 6.66117 6.16117C4.31696 8.50537 3 11.6848 3 15C3 20.525 6.5875 25.2125 11.55 26.875C12.175 26.975 12.375 26.5875 12.375 26.25V24.1375C8.9125 24.8875 8.175 22.4625 8.175 22.4625C7.6 21.0125 6.7875 20.625 6.7875 20.625C5.65 19.85 6.875 19.875 6.875 19.875C8.125 19.9625 8.7875 21.1625 8.7875 21.1625C9.875 23.0625 11.7125 22.5 12.425 22.2C12.5375 21.3875 12.8625 20.8375 13.2125 20.525C10.4375 20.2125 7.525 19.1375 7.525 14.375C7.525 12.9875 8 11.875 8.8125 10.9875C8.6875 10.675 8.25 9.375 8.9375 7.6875C8.9375 7.6875 9.9875 7.35 12.375 8.9625C13.3625 8.6875 14.4375 8.55 15.5 8.55C16.5625 8.55 17.6375 8.6875 18.625 8.9625C21.0125 7.35 22.0625 7.6875 22.0625 7.6875C22.75 9.375 22.3125 10.675 22.1875 10.9875C23 11.875 23.475 12.9875 23.475 14.375C23.475 19.15 20.55 20.2 17.7625 20.5125C18.2125 20.9 18.625 21.6625 18.625 22.825V26.25C18.625 26.5875 18.825 26.9875 19.4625 26.875C24.425 25.2 28 20.525 28 15C28 13.3585 27.6767 11.733 27.0485 10.2165C26.4203 8.69989 25.4996 7.3219 24.3388 6.16117C23.1781 5.00043 21.8001 4.07969 20.2835 3.45151C18.767 2.82332 17.1415 2.5 15.5 2.5Z" />
                </svg>
              </a>
              <a href='https://www.linkedin.com/in/brendanslewis/' target='_blank'>
                <svg className={`${currentMode === 'light' ? 'fill-(--lm-text) stroke-(--lm-bg-dark)' : 'fill-(--dm-text) stroke-(--dm-bg-dark)'}`} width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.25 3.75C24.913 3.75 25.5489 4.01339 26.0178 4.48223C26.4866 4.95107 26.75 5.58696 26.75 6.25V23.75C26.75 24.413 26.4866 25.0489 26.0178 25.5178C25.5489 25.9866 24.913 26.25 24.25 26.25H6.75C6.08696 26.25 5.45107 25.9866 4.98223 25.5178C4.51339 25.0489 4.25 24.413 4.25 23.75V6.25C4.25 5.58696 4.51339 4.95107 4.98223 4.48223C5.45107 4.01339 6.08696 3.75 6.75 3.75H24.25ZM23.625 23.125V16.5C23.625 15.4192 23.1957 14.3828 22.4315 13.6185C21.6672 12.8543 20.6308 12.425 19.55 12.425C18.4875 12.425 17.25 13.075 16.65 14.05V12.6625H13.1625V23.125H16.65V16.9625C16.65 16 17.425 15.2125 18.3875 15.2125C18.8516 15.2125 19.2967 15.3969 19.6249 15.7251C19.9531 16.0533 20.1375 16.4984 20.1375 16.9625V23.125H23.625ZM9.1 10.7C9.65695 10.7 10.1911 10.4788 10.5849 10.0849C10.9788 9.6911 11.2 9.15695 11.2 8.6C11.2 7.4375 10.2625 6.4875 9.1 6.4875C8.53973 6.4875 8.00241 6.71007 7.60624 7.10624C7.21007 7.50241 6.9875 8.03973 6.9875 8.6C6.9875 9.7625 7.9375 10.7 9.1 10.7ZM10.8375 23.125V12.6625H7.375V23.125H10.8375Z" />
                </svg>
              </a>
              <svg className={`${currentMode === 'light' ? 'fill-(--lm-text) stroke-(--lm-bg-dark)' : 'fill-(--dm-text) stroke-(--dm-bg-dark)'} hover:cursor-pointer`} onClick={() => {
                setRotate(!rotate);
                dispatch(toggleTheme());
              }} width="31" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5Z"  />
                <path d="M16.243 7.75702C15.1177 6.63171 13.5915 5.99951 12 5.99951C10.4086 5.99951 8.88233 6.63171 7.75702 7.75702C6.63171 8.88233 5.99951 10.4086 5.99951 12C5.99951 13.5915 6.63171 15.1177 7.75702 16.243L12 12L16.243 7.75702Z" />
              </svg>
            </div>
        </div>
      </header>
      <section className='flex flex-col justify-center items-center gap-8 w-full relative p-4'>
        <div className='flex flex-col gap-4 w-full lg:max-w-[64.5rem]'>
          <div className="w-full h-[100px] lg:h-[200px] rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${subredditInfo.header})`}}></div>
          <div className='flex flex-col lg:flex-row justify-start items-start gap-8'>
            <article className='flex flex-col justify-center w-full lg:max-w-[43.75rem]'>
                <span className={`text-3xl font-bold ${currentMode == 'light' ? 'text-(--lm-text)' : 'text-(--dm-text)'}`}>{`Current Viewing r/${subredditInfo.name}`}</span>
                {currentPost?.map((post, index) => {
                  return (
                    <Post postKey={index} theme={currentMode} data={post} abbreviate={abbreviateSubscribers}  />
                  )
                })}
            </article>
            <aside className={`flex flex-col gap-2 w-full lg:max-w-[18.75rem] ${currentMode == 'light' ? 'bg-(--lm-bg)' : 'bg-(--dm-bg)'} rounded-lg p-4`}>
              <span className={`${currentMode == 'light' ? 'text-(--lm-text)' : 'text-(--dm-text)'}`}>Popular Subreddits</span>
              <div className='flex flex-col gap-2'>
                {subreddits?.map((subreddit, index) => {
                  return (
                    <div onClick={() => {
                      fetchPost(subreddit.data.display_name)
                      setSubredditInfo({name: subreddit.data.display_name, description: subreddit.data.description, header: subreddit.data.banner_img || '/defaultbanner.png'})
                      scrollToTop();
                    }} className={`flex items-center gap-4 lg:hover:cursor-pointer ${currentMode == 'light' ? 'hover:bg-(--lm-bg-light)' : 'hover:bg-(--dm-bg-light)'} rounded-lg p-2`}>
                      <figure className='overflow-hidden rounded-full'>
                        <img className='w-[1.5rem] h-[1.5rem]' src={subreddit.data.icon_img || `/subredditdefault.png`} alt={subreddit.data.display_name} key={index} />
                      </figure>
                      <div>
                        <p className={`${currentMode == 'light' ? 'text-(--lm-text)' : 'text-(--dm-text)'}`}>{`r/${subreddit.data.display_name}`}</p>
                        <p className={`${currentMode == 'light' ? 'text-(--lm-text-muted)' : 'text-(--dm-text-muted)'}`}>{`${abbreviateSubscribers(subreddit.data.subscribers)} Subs`}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
