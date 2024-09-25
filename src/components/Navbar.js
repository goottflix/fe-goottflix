import React, {useState, useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; // CSS 파일 임포트
import NotifyPopup from "./NotifyPopup";
import axios from "axios";

const Navbar = () => {

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }

    // 메뉴를 수동으로 닫는 함수임
    const closeMenu = () => {
        const navbar = document.getElementById('navbarNav');
        if (navbar.classList.contains('show')) {
            navbar.classList.remove('show');
        }
    };

    // 2. 페이지 외부 클릭 시 팝업을 닫는 함수
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setIsPopupOpen(false); // 팝업 외부를 클릭하면 팝업을 닫음
        }
    };

    // 3. 페이지 렌더링 시 클릭 이벤트 등록
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside); // 마우스 클릭 이벤트 리스너 추가
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // 컴포넌트가 언마운트될 때 리스너 제거
        };
    }, []);



    window.IMP.init("imp77446200");

    const onClickPay = async () => {
        window.IMP.request_pay({
            pg: "kakaopay",
            pay_method: "card",
            amount: "9900",
            name: "구독",
        }, function(response){
            const {status, err_msg} = response;
            if(err_msg){
                alert(err_msg);
            }
            if(status==="paid"){
                alert("구독 결제 완료");
                subscribe_success();
            }

        });
    };

    const subscribe_success = async () => {
        try{
            await axios.post("http://localhost:8080/api/subscribe",null,{
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true  // 쿠키를 포함하여 요청
            });
        }catch (err){
            alert(err);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#001f3f' }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" onClick={closeMenu}>
                    <img
                        src="/images/goottflix.png"
                        alt="GoottFlix Logo"
                        style={{ height: '60px' }}
                    />  GoottFlix
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="payment-button" type="button" onClick={onClickPay}>
                                구독
                            </button>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/"
                                  onClick={closeMenu}>메인페이지</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup" onClick={closeMenu}>회원가입</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">로그인</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
