import { useState } from 'react';


export default function Post({ postKey, theme, data, abbreviate }) {

//State To Control If Comments Section Is Open.
const [open, setOpen] = useState(false);

//State To Control The Comments Data.
const [comments, setComments] = useState(null);


const fetchComments = async () => {
  try {
    //If We Already Grabbed The Comments, Leave
    if(comments) return;

    const response = await fetch(
      `https://www.reddit.com/r/${data.data.subreddit}/comments/${data.data.id}.json?limit=6&sort=top`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.status}`);
    }

    const commentData = await response.json();
    
    setComments(commentData[1].data.children);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};


    return (
        <div key={postKey} className={`${theme == 'light' ? 'border-(--lm-bg)' : 'border-(--dm-bg)'} flex flex-col gap-4 w-full py-4 border-b-2`}>
            <div className='flex flex-col gap-2'>
                <h2 className={`${theme == 'light' ? 'text-(--lm-text-muted)' : 'text-(--dm-text-muted)'}`}>{`u/${data.data.author}`}</h2>
                <div className='flex flex-col gap-1'>
                    <h1 className={`${theme == 'light' ? 'text-(--lm-text)' : 'text-(--dm-text)'}`}>{data.data.title}</h1>
                    <p className={`${theme == 'light' ? 'text-(--lm-text-muted)' : 'text-(--dm-text-muted)'} clamptext`}>{data.data.selftext}</p>
                </div>
            </div>
            <figure className="overflow-hidden rounded-lg">
                {data?.data?.preview?.images?.[0]?.source?.url ? (
                    <img
                    className='w-full'
                    src={data.data.preview.images[0].source.url.replace(/&amp;/g, '&')}
                    alt={data.data.title}
                    />
                ) : null}
            </figure>
            <div className='flex gap-2'>
                <div className={`postButton ${theme == 'light' ? 'bg-(--lm-bg) text-(--lm-text)' : 'bg-(--dm-bg) text-(--dm-text)'}`}>
                    <svg className={`${theme == 'light' ? 'stroke-(--lm-text)' : 'stroke-(--dm-text)'}`} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className={`${theme == 'light' ? 'stroke-(--lm-text)' : 'stroke-(--dm-text)'}`} d="M8 17L12 13L16 17M8 11L12 7L16 11" stroke="" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {`${abbreviate(data.data.ups)}`}
                </div>
                <div onClick={() => {setOpen(!open); fetchComments();}} className={`postButton ${theme == 'light' ? 'bg-(--lm-bg) text-(--lmg-text)' : 'bg-(--dm-bg) text-(--dm-text)'} flex gap-1 lg:hover:cursor-pointer`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className={`${theme == 'light' ? 'fill-(--lm-text)' : 'fill-(--dm-text)'}`} d="M5 18V21.766L6.515 20.857L11.277 18H16C17.103 18 18 17.103 18 16V8C18 6.897 17.103 6 16 6H4C2.897 6 2 6.897 2 8V16C2 17.103 2.897 18 4 18H5ZM4 8H16V16H10.723L7 18.234V16H4V8Z" fill=""/>
                        <path className={`${theme == 'light' ? 'fill-(--lm-text)' : 'fill-(--dm-text)'}`} d="M20 2H8C6.897 2 6 2.897 6 4H18C19.103 4 20 4.897 20 6V14C21.103 14 22 13.103 22 12V4C22 2.897 21.103 2 20 2Z" fill=""/>
                    </svg>
                    {`${abbreviate(data.data.num_comments)}`}
                </div>
                <a href={`${data.data.url}`} className={`postButton ${theme == 'light' ? 'bg-(--lm-bg) text-(--lmg-text)' : 'bg-(--dm-bg) text-(--dm-text)'}`}>
                    View On Reddit
                </a>
            </div>
            <div className={`flex flex-col gap-2 ${open ? 'block' : 'hidden'} ${theme == 'light' ? 'text-(--lm-text)' : 'text-(--dm-text)'}`}>
                Comments
                {comments?.map((comment, index) => {
                    return (
                        <div key={index} className={`${theme == 'light' ? 'bg-(--lm-bg)' : 'bg-(--dm-bg)'} p-4 flex flex-col gap-2 rounded-lg`}>
                            <h2 className={`${theme == 'light' ? 'text-(--lm-text-muted)' : 'text-(--dm-text-muted)'}`}>{`u/${comment.data.author}`}</h2>
                            <p className={`${theme == 'light' ? 'text-(--lm-text-muted)' : 'text-(--dm-text-muted)'}`}>{comment.data.body}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}