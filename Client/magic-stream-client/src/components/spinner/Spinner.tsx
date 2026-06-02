const Spinner = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
            }}
        >
            <span
                className='spinner-border'
                role='status'
                aria-hidden='true'
                style={{ width: '5rem', height: '5rem', fontSize: '2rem' }}
            ></span>
        </div>
    )
}

export default Spinner