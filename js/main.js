document.addEventListener('DOMContentLoaded', () => {

// Data Mock DB (Single Source of Truth)
const mockDB = {
    zones: [
        { id: 'Z-A', name: 'Zone A', status: '운영상태', statusClass: 'blue', capacity: 40, sessionId: 'S-1' },
        { id: 'Z-B', name: 'Zone B', status: 'Zone Over Capacity', statusClass: 'orange', capacity: 30, sessionId: 'S-3' },
        { id: 'Z-C', name: 'Zone C', status: '운영상태', statusClass: 'blue', capacity: 30, sessionId: 'S-4' },
        { id: 'Z-D', name: 'Zone D', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-5' },
        { id: 'Z-E', name: 'Zone E', status: '대기상태', statusClass: 'green', capacity: 20, sessionId: 'S-2' },
        { id: 'Z-F', name: 'Zone F', status: '운영상태', statusClass: 'blue', capacity: 40, sessionId: 'S-2' }
    ],
    sessions: {
        'S-1': 'VR Adventure',
        'S-2': 'Space Battle VR',
        'S-3': 'Underwater World',
        'S-4': 'Flight Simulator',
        'S-5': 'Desert Adventure'
    },
    waves: [
        { id: 'W-01', zoneId: 'Z-F', status: 'Ready', members: 4, time: '13:00' },
        { id: 'W-02', zoneId: 'Z-F', status: 'Ready', members: 3, time: '13:10' },
        { id: 'W-03', zoneId: 'Z-F', status: 'Active', members: 4, time: '13:20' },
        { id: 'W-04', zoneId: 'Z-E', status: 'Check-in', members: 2, time: '13:30', cColor: 'border-left-blue' },
        { id: 'W-05', zoneId: 'Z-E', status: 'Ready', members: 3, time: '13:40' },
        { id: 'W-06', zoneId: 'Z-D', status: 'Wave Warning', members: 2, time: '13:50', isWarning: true, cColor: 'border-left-orange' },
        { id: 'W-07', zoneId: 'Z-D', status: 'Active', members: 4, time: '14:00' },
        { id: 'W-08', zoneId: 'Z-C', status: 'Check-in', members: 3, time: '14:10', cColor: 'border-left-blue' },
        { id: 'W-09', zoneId: 'Z-C', status: 'Check-in', members: 2, time: '14:20', cColor: 'border-left-blue' },
        { id: 'W-10', zoneId: 'Z-B', status: 'Wave Pause', members: 3, time: '14:30', isWarning: true, cColor: 'border-left-orange' },
        { id: 'W-11', zoneId: 'Z-B', status: 'Wave Pause', members: 2, time: '14:40', isWarning: true, cColor: 'border-left-orange' },
        { id: 'W-12', zoneId: 'Z-B', status: 'Wave Pause', members: 3, time: '14:50', isWarning: true, cColor: 'border-left-orange' },
        { id: 'W-13', zoneId: 'Z-A', status: 'Active', members: 3, time: '15:00' },
        { id: 'W-14', zoneId: 'Z-A', status: 'Active', members: 2, time: '15:10' },
        { id: 'W-15', zoneId: 'Z-A', status: 'Active', members: 4, time: '15:20' },
        { id: 'W-16', zoneId: 'Z-A', status: 'Active', members: 3, time: '15:30' },
        { id: 'W-17', zoneId: 'Z-A', status: 'Active', members: 3, time: '15:40' },
        { id: 'W-18', zoneId: 'Z-A', status: 'Active', members: 2, time: '15:50' },
        { id: 'W-19', zoneId: 'Z-A', status: 'Active', members: 3, time: '16:00' },
        { id: 'W-20', zoneId: 'Z-C', status: 'Check-in', members: 3, time: '16:10', cColor: 'border-left-blue' },
        { id: 'W-21', zoneId: 'Z-B', status: 'Wave Warning', members: 3, time: '16:20', isWarning: true, cColor: 'border-left-orange' }
    ],
    hmds: [],
    events: [    
        { type: 'HMD Out of Bound', title: 'HMD-003 경계 이탈', desc: 'Zone F에서 HMD-003 사용자가 체험 공간 경계를 이탈했습니다.', time: '방금 전', cls: 'danger text-red', icon: '⚠' },
        { type: 'Wave Pause', title: 'W-10 체험 일시 중단', desc: 'Zone B에서 구성원 장비 문제로 인해 W-10 체험이 일시 중단되었습니다.', time: '2분 전', cls: 'warning text-orange', icon: '⏸' },
        { type: 'Zone Over Capacity', title: 'Zone B 수용 인원 초과 위험', desc: 'Zone B의 권장 수용 인원(40명)을 초과할 위험이 있습니다.', time: '5분 전', cls: 'danger text-red', icon: '🚨' },
        { type: 'Session Over Capacity', title: 'VR Adventure 세션 인원 초과', desc: '현재 활성화된 VR Adventure 세션의 참여 인원이 통제 범위를 초과했습니다.', time: '10분 전', cls: 'danger text-red', icon: '🚨' },
        { type: 'Wave Warning', title: 'W-06 이동 지연', desc: 'Zone D에서 W-06의 다음 세션 이동이 지연되고 있습니다.', time: '12분 전', cls: 'warning text-orange', icon: '⚠' },
        { type: 'HMD Warning', title: 'HMD-002 배터리 부족', desc: '참가자 2의 HMD-002 배터리가 15% 미만입니다.', time: '15분 전', cls: 'warning text-orange', icon: '🔋' },
        { type: 'HMD Pause', title: 'HMD-015 연결 끊김', desc: '트래킹 이상으로 HMD-015의 시스템이 일시 중지되었습니다.', time: '20분 전', cls: 'warning text-orange', icon: '⏸' },
        { type: 'HMD Out of Bound', title: 'HMD-021 경계 이탈', desc: 'Zone A에서 사용자가 안전펜스를 넘었습니다. 즉시 조치 요망.', time: '25분 전', cls: 'danger text-red', icon: '⚠' }
    ]
};

// 동적으로 61개의 HMD(사용자) 데이터 생성 로직
let hmdCounter = 1;
mockDB.waves.forEach(wave => {
    for (let i = 1; i <= wave.members; i++) {
        let status = '체험 (Active)';
        let statusClass = 'outline-blue';
        let battery = Math.floor(Math.random() * 40) + 60; // 60~99%
        
        // 디테일한 상태 부여
        if (wave.status === 'Ready' || wave.status === 'Check-in') {
            status = '온보드 (On-board)';
            statusClass = 'outline-gray';
        }
        
        // 웨이브 경고 상태일 경우 첫 번째 참가자에게 HMD Warning 부여
        if (wave.isWarning && i === 1) {
            status = 'HMD Warning';
            statusClass = 'text-orange outline-orange';
            battery = 15;
        }

        mockDB.hmds.push({
            id: `HMD-${String(hmdCounter).padStart(3, '0')}`,
            waveId: wave.id,
            userId: `M${String(hmdCounter).padStart(3, '0')}`,
            userName: `참가자 ${i}`,
            status: status,
            statusClass: statusClass,
            battery: battery
        });
        hmdCounter++;
    }
});

// CSS 클래스 매핑 헬퍼
const getStatusCss = (status) => {
    switch (status) {
        case 'Active': return 'active';
        case 'Check-in': return 'check-in';
        case 'Ready': return 'ready';
        case 'Wave Warning': case 'Wave Pause': return 'warning';
        default: return 'active';
    }
};

const getZoneName = (zoneId) => mockDB.zones.find(z => z.id === zoneId)?.name || zoneId;

// 경고 개수 측정
const hmdWarningCount = mockDB.hmds.filter(h => h.status === 'HMD Warning').length;
const zoneWarningCount = mockDB.zones.filter(z => z.status === 'Zone Over Capacity').length;

// 메인 렌더링 함수
const initDashboard = () => {
    // 1. 상단 요약 데이터 렌더링
    document.getElementById('valTotalHmd').innerText = mockDB.hmds.length;
    document.getElementById('valTotalWave').innerText = mockDB.waves.length;
    document.getElementById('valHmdWarning').innerText = hmdWarningCount;
    document.getElementById('valZoneWarning').innerText = zoneWarningCount;

    // 2. 이벤트 사이드바 렌더링
    document.getElementById('eventBadge').innerText = mockDB.events.length;
    document.getElementById('eventHeaderBadge').innerText = mockDB.events.length;
    const eventContainer = document.getElementById('eventListContainer');
    eventContainer.innerHTML = mockDB.events.map(ev => `
        <div class="event-item ${ev.cls.split(' ')[0]}">
            <div class="e-icon">${ev.icon}</div>
            <div class="e-content">
                <span class="e-type ${ev.cls.split(' ')[1]}">${ev.type}</span>
                <span class="e-title">${ev.title}</span>
                <span class="e-desc">${ev.desc}</span>
                <span class="e-time">${ev.time}</span>
            </div>
        </div>
    `).join('');

    // 3. 좌측 전체 Wave 리스트 렌더링
    const waveContainer = document.getElementById('waveListContainer');
    document.getElementById('waveSubtitle').innerText = `활성 Wave ${mockDB.waves.length}개 / 참가자 총 ${mockDB.hmds.length}명`;
    
    waveContainer.innerHTML = mockDB.waves.map(wave => {
        const cls = getStatusCss(wave.status);
        const bgStyle = wave.isWarning ? `style="background-color: var(--color-orange); color: white;"` : '';
        return `
        <div class="wave-card ${wave.cColor || ''}" data-wave="${wave.id}">
            <div class="wave-header">
                <h3>${wave.id}</h3>
                <span class="status-badge ${cls}" ${bgStyle}>${wave.status}</span>
            </div>
            <div class="wave-body">
                <div class="wave-info"><span class="icon">📍</span> ${getZoneName(wave.zoneId)}</div>
                <div class="wave-meta">
                    <span><span class="icon">🕒</span> ${wave.time}</span>
                    <span><span class="icon">👥</span> ${wave.members}명</span>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Zone에 소속된 데이터 사전 집계
    const zoneData = {};
    mockDB.waves.forEach(w => {
        if (!zoneData[w.zoneId]) {
            zoneData[w.zoneId] = { waveCount: 0, users: 0, waves: [] };
        }
        zoneData[w.zoneId].waveCount++;
        zoneData[w.zoneId].users += w.members;
        zoneData[w.zoneId].waves.push(w);
    });

    // 4. 우측 Zone 전체 그리드 렌더링
    const zoneContainer = document.getElementById('zoneGridContainer');
    zoneContainer.innerHTML = mockDB.zones.map(zone => {
        const stats = zoneData[zone.id] || { waveCount: 0, users: 0, waves: [] };
        const borderCls = zone.status === '운영상태' ? 'operating' : (zone.status === '대기상태' ? 'waiting' : 'warning');
        
        let tagsHTML = stats.waves.map(w => {
            const color = w.isWarning ? 'red' : (w.status === 'Check-in' ? 'blue' : (w.status === 'Ready' ? 'gray' : 'green'));
            return `<span class="tag ${color}">${w.id}</span>`;
        }).join('');

        return `
        <div class="zone-card ${borderCls}" data-zone="${zone.id}">
            ${zone.statusClass === 'orange' ? '<div class="warning-icon">⚠️</div>' : ''}
            <div class="zone-header">
                <h3>${zone.name}</h3>
                <span class="status-label ${zone.statusClass}">${zone.status}</span>
            </div>
            <div class="zone-stats">
                <div class="stat-row"><span class="label">WAVE 수</span><span class="value">${stats.waveCount}</span></div>
                <div class="stat-row"><span class="label">총 인원</span><span class="value"><span class="icon">👥</span> ${stats.users}명</span></div>
            </div>
            <div class="zone-waves">
                <div class="label">현재 WAVE 목록</div>
                <div class="wave-tags">${tagsHTML}</div>
            </div>
        </div>
        `;
    }).join('');

    // 모든 렌더링 후 이벤트 리스너 바인딩
    bindInteractions(zoneData);
};

// 인터랙션 (이벤트 바인딩) 처리 함수
const bindInteractions = (zoneData) => {
    const waveModal = document.getElementById('waveDetailModal');
    const zoneModal = document.getElementById('zoneDetailModal');
    
    // Wave 카드 및 태그 클릭 처리
    document.querySelectorAll('.wave-card, .zone-waves .tag').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = el.dataset.wave || el.innerText.trim();
            const wave = mockDB.waves.find(w => w.id === id);
            if(wave) openWaveModal(wave);
        });
    });

    // Zone 카드 클릭 처리
    document.querySelectorAll('.zone-card').forEach(card => {
        card.addEventListener('click', () => {
            const zone = mockDB.zones.find(z => z.id === card.dataset.zone);
            if(zone) openZoneModal(zone, zoneData[zone.id]);
        });
    });

    // 사이드바 네비게이션 액티브 효과
    const navItems = document.querySelectorAll('.sidebar-nav ul li');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // 이벤트 사이드바 토글
    const opEventBtn = document.getElementById('opEventBtn');
    const eventSidebar = document.getElementById('eventSidebar');
    const eventSidebarOverlay = document.getElementById('eventSidebarOverlay');
    const closeEventSidebarBtn = document.getElementById('closeEventSidebarBtn');

    const toggleEventSidebar = () => {
        if (eventSidebar) eventSidebar.classList.toggle('show');
        if (eventSidebarOverlay) eventSidebarOverlay.classList.toggle('show');
    };

    [opEventBtn, closeEventSidebarBtn, eventSidebarOverlay].forEach(btn => {
        if(btn) btn.addEventListener('click', toggleEventSidebar);
    });

    // 모달 닫기 로직
    const closeModals = () => {
        waveModal.classList.remove('show');
        zoneModal.classList.remove('show');
    };
    document.getElementById('closeModalBtn').addEventListener('click', closeModals);
    document.getElementById('closeZoneModalBtn').addEventListener('click', closeModals);
    document.getElementById('closeZoneModalFullBtn').addEventListener('click', closeModals);
    
    window.addEventListener('click', (e) => {
        if (e.target === waveModal || e.target === zoneModal) closeModals();
    });
};

/* --- 파생 렌더링: 모달 업데이트 (Single Source of Truth) --- */

// Wave 모달 동적 열기
const openWaveModal = (wave) => {
    document.getElementById('mwTitle').innerText = wave.id;
    document.getElementById('mwBadge').innerText = wave.status;
    document.getElementById('mwBadge').className = `status-badge border-badge ${getStatusCss(wave.status)}`;
    if (wave.isWarning) document.getElementById('mwBadge').style = "background-color: var(--color-orange); color: white;";
    else document.getElementById('mwBadge').style = ""; // reset

    const targetZone = mockDB.zones.find(z => z.id === wave.zoneId);
    document.getElementById('mwSession').innerText = mockDB.sessions[targetZone.sessionId] || '미정';
    document.getElementById('mwMembers').innerText = wave.members;
    document.getElementById('mwZone').innerText = targetZone.name;
    document.getElementById('mwStart').innerText = `시작: ${wave.time}`;

    const hmds = mockDB.hmds.filter(h => h.waveId === wave.id);
    document.getElementById('mwTotalMem').innerText = `총 ${hmds.length}명`;
    
    document.getElementById('mwMemberList').innerHTML = hmds.map(hmd => `
        <div class="member-item">
            <div class="member-col info">
                <span class="name">${hmd.userName}</span>
                <span class="id">${hmd.userId}</span>
            </div>
            <div class="member-col hmd">
                <span class="outline-box"><span class="icon">🖥️</span> ${hmd.id}</span>
            </div>
            <div class="member-col status">
                <span class="status-badge ${hmd.statusClass}">${hmd.status}</span>
            </div>
            <div class="member-col battery">
                <span class="outline-box ${hmd.statusClass === 'text-orange outline-orange' ? 'text-orange' : 'outline-green'}"><span class="icon">🔋</span> ${hmd.battery}%</span>
            </div>
            <div class="member-col action text-right">
                <button class="btn-outline"><span class="icon">👁️</span> 화면 보기</button>
                <button class="btn-red"><span class="icon">⏸️</span> 정지</button>
            </div>
        </div>
    `).join('');

    document.getElementById('waveDetailModal').classList.add('show');
};

// Zone 모달 동적 열기
const openZoneModal = (zone, stats) => {
    document.getElementById('mzTitle').innerText = zone.name;
    document.getElementById('mzBadge').innerText = zone.status;
    document.getElementById('mzBadge').className = `status-label ${zone.statusClass}`;
    
    document.getElementById('mzName').innerText = zone.name;
    document.getElementById('mzState').innerText = zone.status;
    document.getElementById('mzState').className = `status-label ${zone.statusClass}`;
    
    document.getElementById('mzCap').innerText = zone.capacity;
    document.getElementById('mzCur').innerText = stats ? stats.users : 0;
    document.getElementById('mzSession').innerText = mockDB.sessions[zone.sessionId] || '-';
    
    const tzWaves = stats ? stats.waves : [];
    document.getElementById('mzWaveList').innerHTML = tzWaves.map(w => {
        const cls = w.isWarning ? 'outline-orange text-orange' : 'outline-green';
        const stText = w.isWarning ? '지연/정지' : ((w.status==='Ready'||w.status==='Check-in') ? w.status : '진행중');
        const sessionName = mockDB.sessions[zone.sessionId];
        return `
            <div class="z-wave-item" data-wave="${w.id}" style="cursor:pointer;" onclick="event.stopPropagation(); window.tempOpenWave('${w.id}');">
                <div class="zw-top">
                    <span class="zw-name">${w.id}</span>
                    <span class="status-badge ${cls}" style="font-size:0.75rem; padding: 4px 10px; border-radius: 12px; font-weight: 700;">${stText}</span>
                </div>
                <div class="zw-bottom">
                    <span class="zw-member">멤버 수: ${w.members}명</span>
                    <span class="zw-time">입장 시간: ${w.time}</span>
                    <span class="zw-session">현재 세션: ${sessionName}</span>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('zoneDetailModal').classList.add('show');
};

// 전역 헬퍼 (존 모달 내부 웨이브 클릭시 동작 위함)
window.tempOpenWave = (waveId) => {
    const wave = mockDB.waves.find(w => w.id === waveId);
    if(wave) openWaveModal(wave);
};

// 1. 초기 렌더링 실행
initDashboard();
console.log('✅ VR Platform Dashboard: Migrated to Single Source Mock DB Architecture!');
});
