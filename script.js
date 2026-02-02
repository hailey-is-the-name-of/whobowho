
document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const subNav = document.getElementById('sub-nav');
    const modal = document.getElementById('candidate-modal');
    const closeModal = document.querySelector('.close-modal');

    // Data Structure
    const districts = ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군', '비례'];

    // Funny Dummy Names
    const names = [
        '김만두', '이김밥', '박삼겹', '최국밥', '정떡볶이', '강순대', '조튀김', '윤라면',
        '장우동', '임쫄면', '한돈까스', '오미자', '서커피', '남라떼', '북아아', '전녹차'
    ];

    const slogans = [
        "나의 만두는 매우 알차서 한입만으로도 배부를 수 있다",
        "국민의 배부름이 곧 나의 기쁨입니다",
        "든든한 한 끼 같은 정치를 하겠습니다",
        "시원한 국물처럼 속 시원한 행정!",
        "매콤달콤 살기 좋은 대구를 만듭니다",
        "속이 꽉 찬 일꾼, 준비된 후보",
        "바삭바삭한 아이디어로 혁신하겠습니다"
    ];

    const careers = [
        "제10대 분식협회회장\n속이꽉찬만두위원회 위원장",
        "전) 대구맛집탐방대장\n현) 바른식생활연구소 소장",
        "전) 전국요리경연대회 금상\n현) 동네맛집살리기 위원장",
        "전) 청년창업멘토단장\n현) 골목상권살리기 본부장"
    ];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Generator function
    function generateCandidates(count, district, type) {
        let results = [];
        for (let i = 0; i < count; i++) {
            results.push({
                name: getRandomItem(names),
                district: district,
                type: type,
                image: 'images/placeholder.svg', // Default
                career: getRandomItem(careers),
                slogan: getRandomItem(slogans),
                bio: `안녕하십니까, ${district} ${type} 후보입니다. 저는 대구의 발전을 위해... (상세 약력 내용)`,
                youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy
                sns: {
                    blog: 'https://blog.naver.com',
                    facebook: 'https://facebook.com'
                }
            });
        }
        return results;
    }

    // Specific Data (Override for Demo)
    const db = {
        mayor: [
            {
                name: '김만두',
                district: '대구광역시',
                type: '시장',
                image: 'images/01.jpg', // Existing asset
                career: '제10대 분식협회회장\n속이꽉찬만두위원회 위원장',
                slogan: '나의 만두는 매우 알차서\n한입만으로도 배부를 수 있다',
                bio: '대구광역시장 후보 김만두입니다. 맛있는 대구, 살기 좋은 대구를 만들겠습니다.',
                youtube: '#',
                sns: { blog: '#', facebook: '#' }
            }
        ],
        district_head: [],
        city_council: {},
        district_council: {}
    };

    // Populate Dummy Data
    // District Head: 2 candidates per district
    districts.forEach(d => {
        if (d !== '비례') {
            db.district_head = db.district_head.concat(generateCandidates(2, d, '구청장/군수'));
        }
    });

    // City Council & District Council: Candidates per district
    districts.forEach(d => {
        db.city_council[d] = generateCandidates(3, d, '광역시의원');
        db.district_council[d] = generateCandidates(4, d, '기초의원');
    });

    // Sub-Nav Rendering
    function renderSubNav(category) {
        subNav.innerHTML = '';
        if (category === 'mayor' || category === 'district_head') {
            subNav.style.display = 'none';
            return;
        }

        subNav.style.display = 'flex';
        districts.forEach(d => {
            const btn = document.createElement('button');
            btn.className = 'sub-pill';
            btn.textContent = d;
            btn.onclick = () => {
                document.querySelectorAll('.sub-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderCandidates(category, d);
            };
            subNav.appendChild(btn);
        });

        // Auto-select first
        subNav.firstChild.click();
    }

    // Main Rendering
    function renderCandidates(category, filterDistrict = null) {
        contentArea.innerHTML = '';

        let data = [];
        let sectionTitle = '';

        if (category === 'mayor') {
            data = db.mayor;
            sectionTitle = '대구광역시장 후보';
        } else if (category === 'district_head') {
            data = db.district_head; // Show all (grouped logic below would be better but simple list for now as per minimal req)
            // Grouping visuals
            sectionTitle = '구청장 · 군수 후보';
        } else if (category === 'city_council') {
            data = db.city_council[filterDistrict];
            sectionTitle = `${filterDistrict} 광역시의원 후보`;
        } else if (category === 'district_council') {
            data = db.district_council[filterDistrict];
            sectionTitle = `${filterDistrict} 기초의원 후보`;
        }

        // Title
        const h2 = document.createElement('h2');
        h2.className = 'category-title';
        h2.textContent = sectionTitle;
        contentArea.appendChild(h2);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'grid';

        if (category === 'district_head') {
            // Group by district for District Head
            // Reset grid for custom grouping
            contentArea.removeChild(grid); // Remove the simple grid

            // Unique districts in data
            const uniqueDistricts = [...new Set(data.map(item => item.district))];

            uniqueDistricts.forEach(d => {
                const dh3 = document.createElement('h3');
                dh3.className = 'district-separator';
                dh3.textContent = d;
                contentArea.appendChild(dh3);

                const dGrid = document.createElement('div');
                dGrid.className = 'grid';
                const dCandidates = data.filter(item => item.district === d);

                dCandidates.forEach(c => dGrid.appendChild(createCard(c)));
                contentArea.appendChild(dGrid);
            });

        } else {
            // Standard Grid
            data.forEach(c => {
                grid.appendChild(createCard(c));
            });
            contentArea.appendChild(grid);
        }
    }

    function createCard(c) {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="photo">
                    <img src="${c.image}" alt="${c.name}" onerror="this.src='images/placeholder.svg'">
                </div>
                <div class="divider"></div>
                <div class="name">${c.name}</div>
                <div class="divider"></div>
                <div class="meta">${c.career.replace(/\n/g, '<br>')}</div>
                <div class="divider"></div>
                <div class="quote">
                    <div class="label">후보 한마디</div><br>
                    “${c.slogan}”
                </div>
                <button class="btn-detail" onclick="openModal('${c.name}')">자세히 알아보기</button>
            </div>
        `;
        // Store data for modal
        card.dataset.json = JSON.stringify(c);
        card.querySelector('.btn-detail').onclick = () => openModal(c);
        return card;
    }

    // Modal Logic
    window.openModal = (c) => {
        document.getElementById('m-name').textContent = c.name;
        document.getElementById('m-title').textContent = `${c.district} ${c.type}`;
        document.getElementById('m-bio').textContent = c.bio;

        const links = document.getElementById('m-links');
        links.innerHTML = '';
        if (c.youtube) links.innerHTML += `<a href="${c.youtube}" target="_blank" class="btn-link yt">유튜브 영상 보기</a>`;
        if (c.sns.blog) links.innerHTML += `<a href="${c.sns.blog}" target="_blank" class="btn-link blog">블로그</a>`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.onclick = (e) => {
        if (e.target == modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Navigation Events
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Active State
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const category = e.target.dataset.category;
            renderSubNav(category);
            if (category === 'mayor' || category === 'district_head') {
                renderCandidates(category);
            }
        });
    });

    // Init
    document.querySelector('[data-category="mayor"]').click();
});
