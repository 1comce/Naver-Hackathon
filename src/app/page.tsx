
export default function Page() {
  return (
    <div className='w-screen h-screen bg-black'>
      <div className='content'>
        <img
          src={"/naver-logo.svg"}
          alt='NAVER Vietnam AI Hackathon'
          className='logo'
        />

        <div className='greeting'>
          <p className='hello'>Xin chào! 안녕하세요!</p>
          <p className='subtitle'>Hello World</p>
        </div>
      </div>

      <img className='graphic' src={"/hackathonGraphic"} alt='' />
    </div>
  );
}
