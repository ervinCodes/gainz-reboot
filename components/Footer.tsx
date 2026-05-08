
export default function Footer() {
    return (
        <footer className='w-full bottom-0 z-50 text-white flex flex-col items-center gap-3 pt-16'>
            <div className="flex flex-row gap-3">
                <a href='https://www.linkedin.com/in/ervindev/' target='_blank'>
                    <img src='/images/linkedin.png' className='h-10 w-auto'></img>
                </a>
                <a href='https://twitter.com/ervin_dev' target='_blank'>
                    <img src='/images/x.png' className='h-10 w-auto'></img>
                </a>
            </div>
            <div>
                <p>&copy; 2024 Gainz. All rights reserved.</p>
            </div>
        </footer>
    )
}