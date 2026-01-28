// 섹션 전환 기능
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');

            // 모든 버튼 비활성화
            navButtons.forEach(btn => btn.classList.remove('active'));
            // 모든 섹션 숨기기
            contentSections.forEach(section => section.classList.remove('active'));

            // 선택한 버튼 활성화
            button.classList.add('active');
            // 해당 섹션 표시
            document.getElementById(targetSection).classList.add('active');

            // 부드러운 스크롤
            document.getElementById(targetSection).scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });

    // 체크리스트 저장 기능
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    
    // 저장된 체크리스트 불러오기
    checkboxes.forEach(checkbox => {
        const label = checkbox.closest('label');
        const text = label.querySelector('span').textContent.trim();
        const savedState = localStorage.getItem(`checklist-${text}`);
        if (savedState === 'true') {
            checkbox.checked = true;
        }
    });

    // 체크리스트 변경 시 저장
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const label = checkbox.closest('label');
            const text = label.querySelector('span').textContent.trim();
            const key = `checklist-${text}`;
            localStorage.setItem(key, checkbox.checked);
        });
    });

    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 모든 카드와 박스에 애니메이션 적용
    document.querySelectorAll('.info-box, .attraction-card, .timeline-item, .food-category, .transport-card, .checklist-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 벚꽃 낙하 효과 (여러 개)
    function createSakura() {
        const sakura = document.createElement('div');
        sakura.style.position = 'fixed';
        sakura.style.width = '20px';
        sakura.style.height = '20px';
        sakura.style.background = 'rgba(255, 182, 193, 0.6)';
        sakura.style.borderRadius = '50% 0 50% 0';
        sakura.style.left = Math.random() * 100 + '%';
        sakura.style.top = '-20px';
        sakura.style.pointerEvents = 'none';
        sakura.style.zIndex = '0';
        sakura.style.animation = `sakuraFall ${5 + Math.random() * 5}s linear forwards`;
        document.body.appendChild(sakura);

        setTimeout(() => {
            sakura.remove();
        }, 10000);
    }

    // 벚꽃 생성 (간격을 두고)
    setInterval(createSakura, 2000);

    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sakuraFall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 관광지 상세 정보 데이터
    const attractionData = {
        kiyomizu: {
            title: '기요미즈데라',
            subtitle: '清水寺',
            location: '📍 동부 교토',
            hours: '⏰ 6:00 - 18:00',
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&h=800&fit=crop&q=80',
            description: '기요미즈데라는 교토에서 가장 유명한 사원 중 하나로, 1994년 유네스코 세계문화유산으로 등록되었습니다. "맑은 물의 사원"이라는 뜻으로, 목조 건축물의 대표작인 본당이 절벽 위에 세워져 있어 인상적입니다. 특히 벚꽃과 단풍 시즌에는 수많은 관광객이 찾는 명소입니다.',
            tips: [
                '오전 일찍 방문하면 사람이 적어 더 편안하게 관람할 수 있습니다',
                '본당에서 내려다보는 교토 시내 전경이 일품입니다',
                '입장료는 400엔이며, 특별 관람은 추가 요금이 있습니다',
                '계단이 많으니 편한 신발을 신는 것을 추천합니다',
                '사원 내부는 사진 촬영이 제한될 수 있으니 확인하세요',
                '인기 관광지라 주말과 공휴일에는 매우 붐빕니다'
            ]
        },
        arashiyama: {
            title: '아라시야마 대나무 숲',
            subtitle: '竹林の小径',
            location: '📍 서부 교토',
            hours: '⏰ 24시간',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop&q=80',
            description: '아라시야마 대나무 숲은 교토 서부의 대표적인 자연 명소입니다. 약 500m에 걸쳐 늘어선 울창한 대나무 숲은 걸어다니기만 해도 마음이 평온해지는 특별한 경험을 선사합니다. 특히 아침 일출 시간대와 저녁 해질 무렵의 분위기가 환상적입니다.',
            tips: [
                '아침 일찍(7-8시) 방문하면 사람이 적고 사진 찍기 좋습니다',
                '대나무 숲은 24시간 개방되어 있지만, 밤에는 조명이 없어 어둡습니다',
                '조용히 걸어야 하므로 큰 소리로 대화하지 마세요',
                '덴류지 사원과 함께 방문하면 좋습니다',
                '계절에 따라 다른 느낌을 주므로 사진을 많이 찍어보세요',
                '대나무 숲 입구 근처에 기념품 가게와 카페가 있습니다'
            ]
        },
        fushimi: {
            title: '후시미 이나리 신사',
            subtitle: '伏見稲荷大社',
            location: '📍 남부 교토',
            hours: '⏰ 24시간',
            image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&h=800&fit=crop&q=80',
            description: '후시미 이나리 신사는 일본 전국에 약 3만 개가 있는 이나리 신사의 총본산입니다. 가장 유명한 것은 약 1만 개의 빨간 토리이(鳥居)가 이어지는 "센본 토리이"입니다. 이 토리이 터널을 따라 산 정상까지 올라갈 수 있으며, 올라가는 길에 여러 작은 신사들이 있습니다.',
            tips: [
                '24시간 개방이지만, 일출과 일몰 시간대가 가장 아름답습니다',
                '산 정상까지 올라가면 약 2-3시간이 소요됩니다',
                '초반부는 사람이 많지만, 올라갈수록 한산해집니다',
                '편한 운동화를 신는 것을 강력히 추천합니다',
                '토리이 터널에서 사진을 찍을 때는 다른 관광객을 배려하세요',
                '여우(狐)는 이나리 신의 사자(使者)로, 여우 조각상이 많이 있습니다',
                '입장료는 무료입니다'
            ]
        },
        gion: {
            title: '기온 거리',
            subtitle: '祇園',
            location: '📍 동부 교토',
            hours: '⏰ 24시간',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop&q=80',
            description: '기온은 교토의 전통 예술과 문화가 살아있는 지역입니다. 전통 기와집(마치야)이 늘어선 거리에서 마이코나 게이샤를 볼 수 있는 곳으로 유명합니다. 저녁 시간대에는 전통 다실과 레스토랑이 문을 열어 특별한 분위기를 연출합니다.',
            tips: [
                '마이코를 보려면 저녁 시간대(5-7시)에 방문하세요',
                '마이코나 게이샤에게 사진을 찍을 때는 예의를 지켜주세요',
                '전통 다실에서 차를 마시며 휴식을 취할 수 있습니다',
                '기온 거리에는 고급 레스토랑이 많아 예약이 필요할 수 있습니다',
                '야사카 신사와 가까워 함께 방문하기 좋습니다',
                '전통 기와집은 사유지이므로 사진 촬영 시 주의하세요',
                '기온 코너(祇園角)에서 전통 공연을 관람할 수 있습니다'
            ]
        },
        kinkakuji: {
            title: '긴카쿠지',
            subtitle: '金閣寺',
            location: '📍 북부 교토',
            hours: '⏰ 9:00 - 17:00',
            image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=800&fit=crop&q=80',
            description: '긴카쿠지(금각사)는 금박으로 덮인 3층 건물로 유명한 사원입니다. 정식 명칭은 로쿠온지(鹿苑寺)이며, 1994년 유네스코 세계문화유산으로 등록되었습니다. 연못에 비친 금각사의 모습은 교토의 대표적인 풍경 중 하나입니다.',
            tips: [
                '입장료는 500엔이며, 입장권이 기념품으로도 좋습니다',
                '오전 일찍이나 오후 늦게 방문하면 사람이 적습니다',
                '연못 반영 사진을 찍으려면 날씨가 좋은 날을 선택하세요',
                '사원 내부는 입장할 수 없고 외부에서만 관람합니다',
                '정원도 아름답게 조성되어 있어 산책하기 좋습니다',
                '관광객이 많아 사진 촬영 시 인내심이 필요합니다',
                '기온과 함께 북부 교토 일정에 포함하기 좋습니다'
            ]
        },
        sannenzaka: {
            title: '산넨자카/니넨자카',
            subtitle: '産寧坂・二寧坂',
            location: '📍 동부 교토',
            hours: '⏰ 9:00 - 18:00',
            image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&h=800&fit=crop&q=80',
            description: '산넨자카와 니넨자카는 기요미즈데라로 향하는 전통 기와집이 늘어선 언덕길입니다. "산넨자카"는 "3년 언덕", "니넨자카"는 "2년 언덕"이라는 뜻으로, 이 언덕을 넘으면 3년(또는 2년) 안에 다시 교토를 방문하게 된다는 전설이 있습니다. 전통 기념품 가게, 카페, 다실이 즐비합니다.',
            tips: [
                '기요미즈데라 방문 전후로 들르기 좋은 곳입니다',
                '전통 기념품과 교토 특산품을 구매할 수 있습니다',
                '언덕길이라 계단이 많으니 편한 신발을 신으세요',
                '카페에서 잠시 휴식을 취하며 전통 건축을 감상할 수 있습니다',
                '사진 촬영하기 좋은 곳이 많습니다',
                '가게들은 보통 오전 9시부터 오후 6시까지 운영합니다',
                '주말과 공휴일에는 매우 붐빕니다',
                '전통 와가시(일본 과자)를 맛볼 수 있는 가게가 많습니다'
            ]
        }
    };

    // 관광지 카드 클릭 이벤트
    const attractionCards = document.querySelectorAll('.attraction-card');
    const modal = document.getElementById('attractionModal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    attractionCards.forEach(card => {
        card.addEventListener('click', () => {
            const attractionId = card.getAttribute('data-attraction');
            const data = attractionData[attractionId];

            if (data) {
                document.getElementById('modalTitle').textContent = data.title;
                document.getElementById('modalSubtitle').textContent = data.subtitle;
                document.getElementById('modalLocation').textContent = data.location;
                document.getElementById('modalHours').textContent = data.hours;
                document.getElementById('modalImage').src = data.image;
                document.getElementById('modalImage').alt = data.title;
                document.getElementById('modalDescription').textContent = data.description;

                const tipsList = document.getElementById('modalTips');
                tipsList.innerHTML = '';
                data.tips.forEach(tip => {
                    const li = document.createElement('li');
                    li.textContent = tip;
                    tipsList.appendChild(li);
                });

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // 모달 닫기
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
