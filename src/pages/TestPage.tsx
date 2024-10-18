

const TestPage = () => {
    const handleClick = () => {
        // window.location.href = 'weixin://dl/business/?t=e2KLFDCo2of';
        // window.location.href = 'weixin://dl/business/?appid=wx5c9674e6177b0f6a&path=file/down';
        window.location.href = 'weixin://dl/business/?appid=wx5db79bd23a923e8e&path=pages/code/code&query=https%3A%2F%2Fqr61.cn%2FotIrfv%2Fq7FLRkb'
    };

    return (
        <div>
            <a href="#" onClick={handleClick}>点击跳转</a>
        </div>
    );
};

export default TestPage;



