document.addEventListener('DOMContentLoaded', () => {

// Data Mock DB (Single Source of Truth)
const mockDB = {
    zones: [
        { id: 'Z-CAL', name: '캘리브레이션 Zone', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-CAL' },
        { id: 'Z-S1', name: 'Zone 1 (세션1)', status: 'Zone Over Capacity', statusClass: 'orange', capacity: 10, sessionId: 'S-01' },
        { id: 'Z-S2', name: 'Zone 2 (세션2)', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-02' },
        { id: 'Z-S3', name: 'Zone 3 (세션3)', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-03' },
        { id: 'Z-S4', name: 'Zone 4 (세션4)', status: '대기상태', statusClass: 'green', capacity: 20, sessionId: 'S-04' },
        { id: 'Z-S5', name: 'Zone 5 (세션5)', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-05' },
        { id: 'Z-S6', name: 'Zone 6 (세션6)', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-06' },
        { id: 'Z-S7', name: 'Zone 7 (세션7)', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-07' },
        { id: 'Z-S8', name: 'Zone 8 (세션8)', status: '운영상태', statusClass: 'blue', capacity: 20, sessionId: 'S-08' },
        { id: 'Z-END', name: '체험 종료 Zone', status: '대기상태', statusClass: 'green', capacity: 20, sessionId: 'S-END' }
    ],
    sessions: {
        'S-CAL': '캘리브레이션 세션',
        'S-01': '세션 #1',
        'S-02': '세션 #2',
        'S-03': '세션 #3',
        'S-04': '세션 #4',
        'S-05': '세션 #5',
        'S-06': '세션 #6',
        'S-07': '세션 #7',
        'S-08': '세션 #8',
        'S-END': '종료 세션'
    },
    waves: [
        { id: 'W-01', zoneId: 'Z-END', status: 'Check-out', members: 4, time: '13:00', cColor: 'border-left-blue' },
        { id: 'W-02', zoneId: 'Z-S8', status: 'Active', members: 3, time: '13:10' },
        { id: 'W-03', zoneId: 'Z-S7', status: 'Active', members: 4, time: '13:20' },
        { id: 'W-04', zoneId: 'Z-S6', status: 'Active', members: 2, time: '13:30' },
        { id: 'W-05', zoneId: 'Z-S5', status: 'Active', members: 3, time: '13:40' },
        { id: 'W-06', zoneId: 'Z-S4', status: 'Wave Pause', members: 4, time: '13:50', isWarning: true, cColor: 'border-left-orange' },
        { id: 'W-07', zoneId: 'Z-S3', status: 'Active', members: 4, time: '14:00' },
        { id: 'W-08', zoneId: 'Z-S2', status: 'Wave Warning', members: 3, time: '14:10', isWarning: true, cColor: 'border-left-orange' },
        { id: 'W-09', zoneId: 'Z-S1', status: 'Active', members: 4, time: '14:20' },
        { id: 'W-10', zoneId: 'Z-S1', status: 'Active', members: 4, time: '14:30' },
        { id: 'W-11', zoneId: 'Z-S1', status: 'Active', members: 4, time: '14:40' },
        { id: 'W-12', zoneId: 'Z-CAL', status: 'Active', members: 3, time: '14:50' },
        { id: 'W-13', zoneId: 'Z-CAL', status: 'Check-in', members: 4, time: '15:00', cColor: 'border-left-blue' },
        { id: 'W-14', zoneId: 'Z-CAL', status: 'Check-in', members: 2, time: '15:10', cColor: 'border-left-blue' },
        { id: 'W-15', zoneId: 'Z-CAL', status: 'Ready', members: 4, time: '15:20' }
    ],
    hmds: [],
    events: [    
        { type: 'HMD Out of Bound', title: 'HMD-030 경계 이탈', desc: 'Zone 1에서 사용자가 일시적 위치 이탈을 발생시켰습니다.', time: '방금 전', cls: 'danger text-red', icon: '⚠' },
        { type: 'Zone Over Capacity', title: 'Zone 1 수용 인원 초과 위험', desc: '세션 #1의 밀집도가 높아 Zone 1 권장 수용 인원(10명) 초과 위험.', time: '2분 전', cls: 'danger text-red', icon: '🚨' },
        { type: 'Wave Warning', title: 'W-08 배터리 부족 및 지연', desc: 'Zone 2에서 W-08 참가자의 배터리가 부족하며 위치 지연이 발생 중입니다.', time: '5분 전', cls: 'warning text-orange', icon: '🔋' },
        { type: 'Wave Pause', title: 'W-06 전면 중단 (HMD 분리)', desc: 'Zone 4에서 참가자의 헤드셋 분리로 인해 체험이 강제 정지(Pause) 되었습니다.', time: '10분 전', cls: 'warning text-orange', icon: '⏸' },
        { type: 'Session Finish', title: 'W-01 세션 종료', desc: 'W-01 그룹이 모든 과정을 마치고 종료 세션(Check-out)에 진입했습니다.', time: '15분 전', cls: 'outline-blue text-blue', icon: '✅' }
    ],
    registrations: [
        { name: '김철수', time: '15:21:05', qr: '발급 완료', qrCls: 'text-success', wave: '미배정', waveCls: 'text-danger' },
        { name: '이영희', time: '15:20:12', 초음: '발급 완료', qr: '발급 완료', qrCls: 'text-success', wave: '미배정', waveCls: 'text-danger' },
        { name: '박민지', time: '15:19:40', qr: '미발급', qrCls: 'text-danger', wave: '미배정', waveCls: 'text-danger' },
        { name: '최동훈', time: '15:15:30', qr: '발급 완료', qrCls: 'text-success', wave: 'W-15 배정완료', waveCls: 'text-blue' },
        { name: '정소라', time: '15:15:05', qr: '발급 완료', qrCls: 'text-success', wave: 'W-15 배정완료', waveCls: 'text-blue' }
    ],
    messages: [
        { id: 'M-01', title: '체험 시작 전 대기 (안내)', type: 'info', body: '잠시 후 체험이 시작될 예정입니다. HMD를 바르게 착용하시고 안면에 맞게 고정해 주세요.', lastUsed: '오늘 10:30' },
        { id: 'M-02', title: '장비 교체 안내 (안내)', type: 'info', body: '안전한 체험을 위해 기기를 교체하고 있습니다. 현장 요원의 지시에 따라 잠시 대기해 주시기 바랍니다.', lastUsed: '어제 14:15' },
        { id: 'M-03', title: '구역 이동 안내 (안내)', type: 'info', body: '현재 구역의 정원이 다 찼습니다. 천천히 초록색 유도등을 따라 다음 구역으로 안전하게 이동해 주세요.', lastUsed: '오늘 11:20' },
        { id: 'M-04', title: '경계 이탈 경고 (안전)', type: 'warn', body: '안전 구역(안내 실선)을 이탈하셨습니다. 주변 충돌 위험이 크니 즉시 한 걸음 뒤로 물러나 주세요.', lastUsed: '방금 전' },
        { id: 'M-05', title: '동선 지연 정체 안내 (경고)', type: 'warn', body: '앞 그룹의 체험이 약간 지연됨에 따라 다소 정체가 있습니다. 현재 위치에서 잠시만 대기해 주시면 감사하겠습니다.', lastUsed: '오늘 09:10' },
        { id: 'M-06', title: '긴급 정지 통보 (긴급)', type: 'danger', body: '🚨 시뮬레이션 시스템 긴급 정지 🚨 구역 내 발생한 안전 문제로 전체 체험을 일시 정지합니다. 그 자리에 바로 멈춰 서서 안전 요원의 직접 안내를 대기해 주세요.', lastUsed: '2일 전' }
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

// Add explicitly broken / available HMDs for Equipment Management Showcase
for(let i=100; i<110; i++) {
    mockDB.hmds.push({
        id: `HMD-${i}`, waveId: null, userId: null, userName: null,
        status: '사용 가능', statusClass: 'avail', battery: 100
    });
}
mockDB.hmds.push({ id: 'HMD-099', waveId: 'W-01', userId: 'M099', userName: '이상동작자', status: 'HMD 오류', statusClass: 'err', battery: 45, errorMsg: '자이로스코프 센서 통신 불량' });
mockDB.hmds.push({ id: 'HMD-098', waveId: 'W-03', userId: 'M098', userName: '연결끊김자', status: '연결 끊김', statusClass: 'err', battery: 80, errorMsg: 'Wi-Fi PING Timeout 연속 발생' });

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

    // 사이드바 네비게이션 및 뷰(View) 전환
    const navItems = document.querySelectorAll('.sidebar-nav ul li');
    const views = {
        'nav-dashboard': document.getElementById('view-dashboard'),
        'nav-opcontrol': document.getElementById('view-opcontrol'),
        'nav-assignment': document.getElementById('view-assignment'),
        'nav-equipment': document.getElementById('view-equipment'),
        'nav-issue': document.getElementById('view-issue'),
        'nav-message': document.getElementById('view-message'),
        'nav-settings': document.getElementById('view-settings')
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            Object.keys(views).forEach(navId => {
                const view = views[navId];
                if(view) {
                    if (item.id === navId) {
                        view.classList.add('active');
                        view.style.display = 'flex';
                        if(navId === 'nav-opcontrol' && window.renderOpControlTables) window.renderOpControlTables();
                        if(navId === 'nav-assignment' && window.renderAssignmentTables) window.renderAssignmentTables();
                        if(navId === 'nav-equipment' && window.renderEquipmentTables) window.renderEquipmentTables();
                        if(navId === 'nav-issue' && window.renderIssueTables) window.renderIssueTables();
                        if(navId === 'nav-message' && window.renderMessageTables) window.renderMessageTables();
                    } else {
                        view.classList.remove('active');
                        view.style.display = 'none';
                    }
                }
            });
        });
    });

    // 운영 관제 서브 탭 전환
    const opTabBtns = document.querySelectorAll('.op-tab-btn');
    const opTabContents = document.querySelectorAll('.op-tab-content');
    
    opTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            opTabBtns.forEach(b => b.classList.remove('active'));
            opTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTab = document.getElementById(btn.dataset.tab);
            if(targetTab) targetTab.classList.add('active');
        });
    });

    // 입장/배정 관리 서브 탭 전환
    const assignTabBtns = document.querySelectorAll('.assign-tab-btn');
    const assignTabContents = document.querySelectorAll('.assign-tab-content');
    
    assignTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            assignTabBtns.forEach(b => b.classList.remove('active'));
            assignTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTabId = btn.dataset.tab;
            const targetTab = document.getElementById(targetTabId);
            if(targetTab) targetTab.classList.add('active');
        });
    });

    // 장비 관리 서브 탭 전환
    const equipTabBtns = document.querySelectorAll('.equip-tab-btn');
    const equipTabContents = document.querySelectorAll('.equip-tab-content');
    
    equipTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            equipTabBtns.forEach(b => b.classList.remove('active'));
            equipTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTab = document.getElementById(btn.dataset.tab);
            if(targetTab) targetTab.classList.add('active');
        });
    });

    // 시스템 설정 서브 탭 전환
    const settingTabBtns = document.querySelectorAll('.setting-tab-btn');
    const settingTabContents = document.querySelectorAll('.setting-tab-content');
    
    settingTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            settingTabBtns.forEach(b => b.classList.remove('active'));
            settingTabContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            
            btn.classList.add('active');
            const targetTab = document.getElementById(btn.dataset.tab);
            if(targetTab) {
                targetTab.classList.add('active');
                targetTab.style.display = 'block';
            }
        });
    });

    // 장비 상세 사이드바 닫기
    document.getElementById('closeEqSidebarBtn')?.addEventListener('click', () => {
        document.getElementById('eqDetailSidebar')?.classList.remove('show');
    });

    // 장비 교체 드롭다운 바인딩
    const checkSwapBtn = () => {
        const eVal = document.getElementById('selErrorEq')?.value;
        const sVal = document.getElementById('selSpareEq')?.value;
        const btn = document.getElementById('btnExecuteSwap');
        if(btn) {
            btn.disabled = !(eVal && sVal);
            btn.style.opacity = (eVal && sVal) ? '1' : '0.5';
        }
    };

    document.getElementById('selErrorEq')?.addEventListener('change', (e) => {
        const hmd = mockDB.hmds.find(h => h.id === e.target.value);
        const card = document.getElementById('cardErrorEq');
        if(!hmd) { card.innerHTML = '<div class="empty-state">장비를 선택하세요</div>'; checkSwapBtn(); return; }
        card.innerHTML = `<div class="eq-swap-detail"><div><strong>상태:</strong> <span class="text-red">${hmd.status}</span></div><div><strong>배터리:</strong> ${hmd.battery}%</div><div><strong>매핑:</strong> ${hmd.userName||'없음'}</div></div>`;
        checkSwapBtn();
    });

    document.getElementById('selSpareEq')?.addEventListener('change', (e) => {
        const hmd = mockDB.hmds.find(h => h.id === e.target.value);
        const card = document.getElementById('cardSpareEq');
        if(!hmd) { card.innerHTML = '<div class="empty-state">장비를 선택하세요</div>'; checkSwapBtn(); return; }
        card.innerHTML = `<div class="eq-swap-detail"><div><strong>상태:</strong> <span class="text-green">사용 가능</span></div><div><strong>배터리:</strong> 100%</div></div>`;
        checkSwapBtn();
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

// --- 운영 관제 (Operations Control) 탭 렌더링 함수 ---
window.renderOpControlTables = () => {
    // 1. 실시간 통합 관제 (rtOpTableBody)
    const rtOpHTML = mockDB.waves.map(wave => {
        const zone = mockDB.zones.find(z => z.id === wave.zoneId);
        const sessionName = zone ? (mockDB.sessions[zone.sessionId] || '미배정') : '미배정';
        const zName = zone ? zone.name : '-';
        const wWarn = wave.isWarning ? '<span class="status-badge text-orange" style="margin-top:4px; display:inline-block;">Wave 지연/경고</span>' : '';
        const zWarn = (zone && zone.statusClass === 'orange') ? '<span class="status-badge text-red outline-orange">혼잡 위기</span>' : '<span class="status-badge outline-green">여유</span>';
        
        return `
            <tr>
                <td><strong>${sessionName}</strong></td>
                <td><span class="status-badge ${getStatusCss(wave.status)}">${wave.id} (${wave.status})</span></td>
                <td><span class="outline-box"><span class="icon">📍</span> ${zName}</span></td>
                <td>${zWarn}</td>
                <td>${wWarn || '-'}</td>
                <td class="text-right action-group">
                    <button class="btn-outline btn-sm" onclick="alert('${wave.id} 강제 이동 명령 전달')">강제 이동</button>
                    <button class="btn-red btn-sm" onclick="alert('${wave.id} 긴급 정지 발동')">정지</button>
                </td>
            </tr>
        `;
    }).join('');
    const rtOpTableBody = document.getElementById('rtOpTableBody');
    if(rtOpTableBody) rtOpTableBody.innerHTML = rtOpHTML;

    // 2. Session 관리 (sessionTableBody)
    const sessionHTML = Object.entries(mockDB.sessions).map(([sId, sName]) => {
        const wavesInSession = mockDB.waves.filter(w => {
            const z = mockDB.zones.find(zone => zone.id === w.zoneId);
            return z && z.sessionId === sId;
        }).length;
        
        return `
            <tr>
                <td>${sId}</td>
                <td><strong>${sName}</strong></td>
                <td><span class="status-badge active">진행 중</span></td>
                <td>${wavesInSession}개 Wave</td>
                <td class="text-right action-group">
                    <button class="btn-outline btn-sm" onclick="alert('${sName} 세션 일시 지연 처리')">지연 처리</button>
                    <button class="btn-red btn-sm" onclick="alert('${sName} 세션 강제 종료')">세션 종료</button>
                </td>
            </tr>
        `;
    }).join('');
    const sessionTableBody = document.getElementById('sessionTableBody');
    if(sessionTableBody) sessionTableBody.innerHTML = sessionHTML;

    // 3. Wave 관리 (waveTableBody)
    const waveHTML = mockDB.waves.map(wave => {
        const zone = mockDB.zones.find(z => z.id === wave.zoneId);
        const sessionName = zone ? (mockDB.sessions[zone.sessionId] || '미배정') : '미배정';
        
        return `
            <tr>
                <td><strong>${wave.id}</strong></td>
                <td>${sessionName}</td>
                <td><span class="status-badge ${getStatusCss(wave.status)}">${wave.status}</span></td>
                <td>${zone ? zone.name : '-'}</td>
                <td>${wave.members}명 (<span class="icon">🔋</span>체크)</td>
                <td class="text-right action-group">
                    <button class="btn-outline btn-sm" onclick="window.tempOpenWave('${wave.id}')">상세 보기</button>
                    <button class="btn-outline btn-sm" style="color:var(--color-orange); border-color:var(--color-orange);" onclick="alert('${wave.id}의 다음 Zone 이동 제한 설정')">이동 제어</button>
                </td>
            </tr>
        `;
    }).join('');
    const waveTableBody = document.getElementById('waveTableBody');
    if(waveTableBody) waveTableBody.innerHTML = waveHTML;

    // 4. Zone 관제 (zoneTableBody)
    const zoneHTML = mockDB.zones.map(zone => {
        const usersInZone = mockDB.waves.filter(w => w.zoneId === zone.id).reduce((sum, w) => sum + w.members, 0);
        const congestionRatio = usersInZone / zone.capacity;
        let congestionHTML = `<div class="progress-bar-bg" style="width:100px; display:inline-block; margin-right:8px; vertical-align:middle; background-color:#e2e8f0;"><div class="progress-bar-fill" style="width:${Math.min(congestionRatio*100, 100)}%; background-color:${congestionRatio > 0.8 ? 'var(--color-red)' : 'var(--sidebar-active)'};"></div></div> <span style="font-weight:700;">${Math.round(congestionRatio*100)}%</span>`;
        
        return `
            <tr>
                <td><strong>${zone.name}</strong></td>
                <td><span class="status-label ${zone.statusClass}">${zone.status}</span></td>
                <td><strong>${usersInZone}명</strong> / ${zone.capacity}명</td>
                <td>${congestionHTML}</td>
                <td class="text-right action-group">
                    <button class="btn-outline btn-sm" onclick="alert('${zone.name} 진입 제한 활성화')">이동 제한</button>
                    <button class="btn-outline btn-sm" style="color:var(--color-orange); border-color:var(--color-orange);" onclick="alert('${zone.name} 우회 설정 작동')">우회 운영</button>
                </td>
            </tr>
        `;
    }).join('');
    const zoneTableBody = document.getElementById('zoneTableBody');
    if(zoneTableBody) zoneTableBody.innerHTML = zoneHTML;
};

// --- 입장/배정 관리 탭 렌더링 함수 ---
window.renderAssignmentTables = () => {
    // 1. 등록 현황 테이블
    if(mockDB.registrations) {
        document.getElementById('valTotalReg').innerText = mockDB.registrations.length + 42; 
        const unassigned = mockDB.registrations.filter(r => r.wave === '미배정').length;
        document.getElementById('valWaitWave').innerText = unassigned;
        document.getElementById('valSessionCap').innerText = '16명';
        
        const regHTML = mockDB.registrations.map(r => `
            <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.time}</td>
                <td><span class="${r.qrCls}"><span class="icon">${r.qr === '발급 완료' ? '✅' : '❌'}</span> ${r.qr}</span></td>
                <td><span class="status-badge ${r.wave === '미배정' ? 'text-red outline-orange' : 'outline-blue'}">${r.wave}</span></td>
                <td class="text-right action-group">
                    <button class="btn-outline btn-sm">수정</button>
                    ${r.qr === '미발급' ? '<button class="btn-outline btn-sm" style="color:var(--color-blue); border-color:var(--color-blue);">QR 재발급</button>' : ''}
                </td>
            </tr>
        `).join('');
        const regBody = document.getElementById('registrationTableBody');
        if(regBody) regBody.innerHTML = regHTML;
    }

    // 2. Wave / QR 매핑 현황 (핵심)
    const assignWaves = mockDB.waves.filter(w => w.status === 'Check-in' || w.status === 'Ready' || w.status === 'Wave Pause');
    
    const waveMapHTML = assignWaves.map(w => {
        let mappedCount = 0;
        const membersHTML = Array.from({length: w.members}).map((_, idx) => {
            // Wave Status에 따른 랜덤 매핑 시뮬레이션
            const isMapped = (w.status !== 'Check-in' && Math.random() > 0.3) || w.status === 'Active' || w.status === 'Ready';
            if (isMapped) mappedCount++;
            const hmdId = isMapped ? `HMD-${Math.floor(Math.random()*50)+10}` : '미지급';
            const hStatus = isMapped ? '연결 완료' : '진행 대기중';
            const hCls = isMapped ? 'text-success' : 'text-danger';
            const name = isMapped ? `참여자 ${idx+1}` : `<span class="text-danger">QR 매핑 대기중</span>`;
            
            return `
                <tr>
                    <td><strong>${name}</strong></td>
                    <td><span class="${hCls}">${isMapped ? '✅ 매핑 완료' : '⚠️ 미매핑'}</span></td>
                    <td><span class="outline-box"><span class="icon">🖥️</span> ${hmdId}</span></td>
                    <td><span class="${hCls}">${hStatus}</span></td>
                    <td class="text-right action-group">
                        <button class="btn-outline btn-sm">재배정</button>
                        ${isMapped ? '<button class="btn-outline btn-sm">강제 해제</button>' : ''}
                    </td>
                </tr>
            `;
        }).join('');
        
        const progPct = Math.round((mappedCount / w.members) * 100);
        
        return `
            <div class="wmap-card">
                <div class="wmap-header">
                    <div class="wmap-title">
                        ${w.id} <span class="status-badge ${getStatusCss(w.status)}">${w.status}</span>
                        <span style="font-size:0.9rem; color:var(--text-muted); margin-left:10px;">${w.members}명 정원</span>
                    </div>
                    <div class="wmap-progress-wrap">
                        <span class="wmap-progress-text">세팅 진행 상태 (${mappedCount}/${w.members})</span>
                        <div class="wmap-progress-bar">
                            <div class="wmap-progress-fill" style="width: ${progPct}%; background-color:${progPct===100 ? '#22c55e' : 'var(--color-blue)'};"></div>
                        </div>
                    </div>
                </div>
                <div class="wmap-body">
                    <table class="wmap-table">
                        <thead>
                            <tr>
                                <th>사용자 등록 명</th>
                                <th>QR 매핑 여부</th>
                                <th>장비 고유 ID</th>
                                <th>장비 연결 통신 상태</th>
                                <th class="text-right">관리자 강제 통제</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${membersHTML}
                        </tbody>
                    </table>
                </div>
                <div class="wmap-footer">
                    <div class="ctrl-left">
                        ${progPct === 100 
                            ? '<div class="ctrl-status ready"><span class="icon">✅</span> READY (전원 매핑 완료)</div>' 
                            : '<div class="ctrl-status wait" style="color:#f59e0b; font-size:1rem;"><span class="icon">⏳</span> 매핑 대기중</div>'
                        }
                    </div>
                    <div class="ctrl-actions">
                        <button class="btn-warning"><span class="icon">⏸</span> HOLD (대기)</button>
                        <button class="btn-success" ${progPct !== 100 ? 'style="opacity:0.4; cursor:not-allowed;"' : ''}><span class="icon">▶</span> Session START</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    const wMapBody = document.getElementById('waveMappingContainer');
    if(wMapBody) wMapBody.innerHTML = waveMapHTML;
};

// --- 장비 관리 탭 렌더링 함수 ---
window.renderEquipmentTables = () => {
    const severityScore = (hmd) => {
        if(hmd.status.includes('오류') || hmd.status.includes('끊김')) return 4;
        if(hmd.battery <= 20) return 3;
        if(hmd.status.includes('사용 가능')) return 1;
        return 2; 
    };
    
    const hmdList = [...mockDB.hmds].sort((a,b) => severityScore(b) - severityScore(a));
    
    // KPI Cards
    const total = hmdList.length;
    let inUse = 0, avail = 0, err = 0, lowBat = 0;
    
    const cardsHTML = hmdList.map(hmd => {
        const score = severityScore(hmd);
        if(score === 4) err++;
        else if(score === 3) lowBat++;
        else if(score === 1) avail++;
        else inUse++;
        
        let sCls = 'use', sText = '사용 중';
        let cardWrapCls = '';
        if(score === 4) { sCls = 'err'; sText = hmd.status; cardWrapCls = 'error'; }
        else if(score === 3) { sCls = 'use'; sText = '배터리 알림'; cardWrapCls = 'lowbat'; inUse++; lowBat++; }
        else if(score === 1) { sCls = 'avail'; sText = '사용 가능'; }
        else { sText = hmd.status; }
        
        const batColor = hmd.battery <= 20 ? '#ef4444' : (hmd.battery <= 50 ? '#f59e0b' : '#22c55e');
        
        let subInfoLine1 = hmd.waveId ? `Wave: <strong>${hmd.waveId}</strong>` : '사용자 매핑: <strong>없음</strong>';
        let subInfoLine2 = hmd.userName ? `사용자: <strong>${hmd.userName}</strong>` : '상태: <span class="text-green">대기장비 준비됨</span>';
        
        return `
            <div class="eq-card ${cardWrapCls}" onclick="openEqSidebar('${hmd.id}')">
                <div class="eq-card-header">
                    <span class="eq-card-id">${hmd.id}</span>
                    <span class="eq-card-status ${sCls}">${sText}</span>
                </div>
                <div class="eq-card-body">
                    <div class="eq-bat-row">
                        <span class="icon" style="color:${batColor}">🔋</span>
                        <div class="eq-bat-bar-wrap">
                            <div class="eq-bat-bar" style="width:${hmd.battery}%; background-color:${batColor};"></div>
                        </div>
                        <span class="eq-bat-text" style="color:${batColor}">${hmd.battery}%</span>
                    </div>
                    <div class="eq-info-row">${subInfoLine1}</div>
                    <div class="eq-info-row">${subInfoLine2}</div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('eqTotal').innerText = total;
    document.getElementById('eqInUse').innerText = inUse;
    document.getElementById('eqAvailable').innerText = avail;
    document.getElementById('eqError').innerText = err;
    document.getElementById('eqLowBat').innerText = lowBat;
    
    const eqGridBoard = document.getElementById('eqGridBoard');
    if(eqGridBoard) eqGridBoard.innerHTML = cardsHTML;
    
    // 장비 교체 드롭다운 채우기
    const errorHmds = hmdList.filter(h => severityScore(h) >= 3);
    const availHmds = hmdList.filter(h => severityScore(h) === 1);
    
    const selErr = document.getElementById('selErrorEq');
    const selSpr = document.getElementById('selSpareEq');
    if(selErr) selErr.innerHTML = '<option value="">장비 선택...</option>' + errorHmds.map(h => `<option value="${h.id}">${h.id} (${h.status})</option>`).join('');
    if(selSpr) selSpr.innerHTML = '<option value="">장비 선택...</option>' + availHmds.map(h => `<option value="${h.id}">${h.id} (100%)</option>`).join('');
};

window.openEqSidebar = (id) => {
    const hmd = mockDB.hmds.find(h => h.id === id);
    if(!hmd) return;
    
    document.getElementById('sdEqId').innerText = hmd.id;
    document.getElementById('sdEqStatusBadge').innerText = hmd.status;
    document.getElementById('sdEqStatusBadge').className = 'status-badge active border-badge'; // default
    if(hmd.status.includes('오류') || hmd.status.includes('끊김')) document.getElementById('sdEqStatusBadge').style = "background:#fee2e2; color:#991b1b; width:fit-content; margin-bottom: 20px;";
    else if(hmd.status.includes('사용 가능')) document.getElementById('sdEqStatusBadge').style = "background:#dcfce7; color:#166534; width:fit-content; margin-bottom: 20px;";
    else document.getElementById('sdEqStatusBadge').style = "background:#dbeafe; color:#1e40af; width:fit-content; margin-bottom: 20px;";
    
    const batColor = hmd.battery <= 20 ? '#ef4444' : '#22c55e';
    document.getElementById('sdEqBattery').innerHTML = `<span class="battery-icon" style="color:${batColor}">🔋</span> <span style="color:${batColor}">${hmd.battery}%</span>`;
    
    document.getElementById('sdEqNetwork').innerText = hmd.status.includes('끊김') ? '❌ 통신 불량 (Ping Fail)' : '✅ 양호 (Ping 12ms)';
    document.getElementById('sdEqUser').innerText = hmd.userName || '미배정';
    document.getElementById('sdEqWaveSession').innerText = hmd.waveId || '- / -';
    
    const errBox = document.getElementById('sdEqErrorBox');
    if(hmd.errorMsg) {
        errBox.style.display = 'flex';
        document.getElementById('sdEqErrorMsg').innerText = hmd.errorMsg;
    } else {
        errBox.style.display = 'none';
    }
    
    const sidebar = document.getElementById('eqDetailSidebar');
    if(sidebar) sidebar.classList.add('show');
    
    const btnSwap = document.getElementById('btnGoToSwap');
    if(btnSwap) {
        btnSwap.onclick = () => {
            const mapTabBtn = document.querySelector('[data-tab="equip-tab-2"]');
            if(mapTabBtn) mapTabBtn.click();
            sidebar.classList.remove('show');
            const selErr = document.getElementById('selErrorEq');
            if(selErr) {
                selErr.value = hmd.id;
                selErr.dispatchEvent(new Event('change'));
            }
        };
    }
};

// --- 운영이슈 / 안전관리 탭 렌더링 함수 ---
window.renderIssueTables = () => {
    // 1. KPI 계산
    const errHmds = mockDB.hmds.filter(h => h.status.includes('오류') || h.status.includes('끊김'));
    const lowBatHmds = mockDB.hmds.filter(h => h.battery <= 20);
    const delayWaves = mockDB.waves.filter(w => w.isWarning || w.status.includes('Warning') || w.status.includes('Pause'));
    const userOuts = mockDB.events.filter(e => e.type.includes('이탈') || e.type.includes('Out of Bound'));
    const zoneConvs = mockDB.events.filter(e => e.type.includes('혼잡') || e.type.includes('Over Capacity'));

    const krHmdErr = document.getElementById('krHmdErr');
    if(krHmdErr) krHmdErr.innerText = errHmds.length;
    
    const krHmdLow = document.getElementById('krHmdLow');
    if(krHmdLow) krHmdLow.innerText = lowBatHmds.length;
    
    const krWaveDelay = document.getElementById('krWaveDelay');
    if(krWaveDelay) krWaveDelay.innerText = delayWaves.length;
    
    const krUserOut = document.getElementById('krUserOut');
    if(krUserOut) krUserOut.innerText = userOuts.length;
    
    const krZoneConv = document.getElementById('krZoneConv');
    if(krZoneConv) krZoneConv.innerText = zoneConvs.length;

    // 종합 상태
    const bigBadge = document.getElementById('kpiBigBadge');
    if(bigBadge) {
        if(errHmds.length >= 2 || delayWaves.length >= 2) {
            bigBadge.className = 'safety-badge danger';
            bigBadge.innerHTML = '🚨 즉각 대응 요망';
        } else if(errHmds.length > 0 || lowBatHmds.length > 0 || delayWaves.length > 0) {
            bigBadge.className = 'safety-badge warning';
            bigBadge.innerHTML = '⚠️ 주의 필요';
        } else {
            bigBadge.className = 'safety-badge safe';
            bigBadge.innerHTML = '✅ 운영 안정';
        }
    }

    // 2. 위험/지연 상세 리스트
    const lstRiskEq = document.getElementById('lstRiskEq');
    const riskHmds = [...errHmds, ...lowBatHmds];
    if(lstRiskEq) {
        if(riskHmds.length === 0) {
            lstRiskEq.innerHTML = '<div class="empty-state">발견된 위험 장비가 없습니다.</div>';
        } else {
            lstRiskEq.innerHTML = riskHmds.map(h => {
                const isErr = h.status.includes('오류') || h.status.includes('끊김');
                const cls = isErr ? 'err' : 'warn';
                const msg = isErr ? (h.errorMsg || '시스템 통신 불량') : `배터리 부족 (${h.battery}%)`;
                return `
                    <div class="issue-item ${cls}">
                        <div class="issue-item-top">
                            <span class="issue-item-title">${h.id}</span>
                            <span class="safety-badge ${isErr?'danger':'warning'}" style="font-size:0.75rem; padding:4px 8px;">${h.status}</span>
                        </div>
                        <div class="issue-item-desc"><strong>원인:</strong> ${msg} <br><strong>소속:</strong> ${h.waveId||'대기중'} / <strong>사용자:</strong> ${h.userName||'없음'}</div>
                    </div>
                `;
            }).join('');
        }
    }

    const lstDelayWv = document.getElementById('lstDelayWv');
    if(lstDelayWv) {
        if(delayWaves.length === 0) {
            lstDelayWv.innerHTML = '<div class="empty-state">지연/문제가 발생한 Group(Wave)이 없습니다.</div>';
        } else {
            lstDelayWv.innerHTML = delayWaves.map(w => {
                const isPause = w.status.includes('Pause');
                const cls = isPause ? 'err' : 'warn';
                const msg = isPause ? '참가자 HMD 탈착에 의한 전체 긴급 정지' : '배터리 이슈 혹은 구역 동선 지연';
                return `
                    <div class="issue-item ${cls}">
                        <div class="issue-item-top">
                            <span class="issue-item-title">${w.id} <span style="color:#94a3b8; font-weight:400; font-size:0.8rem;">(${w.members}명)</span></span>
                            <span class="safety-badge ${isPause?'danger':'warning'}" style="font-size:0.75rem; padding:4px 8px;">${w.status}</span>
                        </div>
                        <div class="issue-item-desc"><strong>원인:</strong> ${msg} <br><strong>현재 Zone:</strong> ${w.zoneId}</div>
                    </div>
                `;
            }).join('');
        }
    }

    // 3. 이벤트 이력 로그 테이블
    window.renderEventLogTable = (filterType = 'all') => {
        let events = [...mockDB.events];
        if(filterType === 'danger') events = events.filter(e => e.cls.includes('danger'));
        else if(filterType === 'warning') events = events.filter(e => e.cls.includes('warning'));
        
        const tbody = document.getElementById('eventHistoryBody');
        if(!tbody) return;
        
        if(events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">조회 조건에 맞는 이력이 없습니다.</td></tr>';
            return;
        }
        
        // 최신 순으로 표시
        tbody.innerHTML = events.reverse().map((e, idx) => {
            const isDanger = e.cls.includes('danger');
            const isWarn = e.cls.includes('warning');
            const sevTag = isDanger 
                ? '<span class="safety-badge danger" style="padding:4px 8px; font-size:0.8rem;">긴급</span>' 
                : (isWarn ? '<span class="safety-badge warning" style="padding:4px 8px; font-size:0.8rem;">주의</span>' : '<span class="safety-badge safe" style="padding:4px 8px; font-size:0.8rem;">안내</span>');
            
            return `
                <tr>
                    <td><strong>${e.time}</strong></td>
                    <td style="color:var(--text-main); font-weight:600;"><span class="icon">${e.icon}</span> ${e.type}</td>
                    <td>${sevTag}</td>
                    <td><strong>${e.title.split(' ')[0]}</strong></td>
                    <td style="color:#64748b;">${e.desc}</td>
                    <td style="text-align:center;">
                        <button class="btn-check ${idx > 1 ? 'done' : ''}" onclick="this.classList.add('done'); this.innerHTML='✓ 조치완료'">${idx > 1 ? '✓ 조치완료' : '미확인/조치대기'}</button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    renderEventLogTable('all');
    
    // 필터 이벤트 바인딩 로직 중복 방지.
    const selFilter = document.getElementById('selEventFilter');
    if(selFilter && !selFilter.dataset.bound) {
        selFilter.dataset.bound = true;
        selFilter.addEventListener('change', (e) => {
            renderEventLogTable(e.target.value);
        });
    }
};

// --- 운영 메시지 관리 (방송) 렌더링 함수 ---
window.renderMessageTables = () => {
    const selTemplate = document.getElementById('selBcastTemplate');
    const prevType = document.getElementById('prevMsgType');
    const prevText = document.getElementById('prevMsgText');
    const lstTemplates = document.getElementById('lstMsgTemplates');

    const typeLabels = { 'info': '일반 안내', 'warn': '사전 경고', 'danger': '긴급 통제' };
    
    // 1. 드롭다운 렌더링
    if(selTemplate) {
        selTemplate.innerHTML = '<option value="">송출할 메시지 템플릿을 선택하세요</option>' + 
            mockDB.messages.map(m => `<option value="${m.id}">[${typeLabels[m.type]}] ${m.title}</option>`).join('');
    }

    // 2. 템플릿 리스트 렌더링
    const renderList = () => {
        if(!lstTemplates) return;
        lstTemplates.innerHTML = mockDB.messages.map(m => `
            <div class="msg-tpl-card" data-id="${m.id}" onclick="selectMsgTemplate('${m.id}')">
                <div class="msg-tpl-header">
                    <span class="msg-tpl-title">${m.title}</span>
                    <span class="msg-tpl-info ${m.type}">${typeLabels[m.type]}</span>
                </div>
                <div class="msg-tpl-body">"${m.body}"</div>
                <div style="font-size:0.75rem; color:#94a3b8; margin-top:6px;">⏱ 최근 사용: ${m.lastUsed}</div>
            </div>
        `).join('');
    };
    renderList();

    // 전역 함수: 리스트 클릭 시 드롭다운 연동 및 프록시 이벤트
    window.selectMsgTemplate = (msgId) => {
        if(selTemplate) selTemplate.value = msgId;
        const evt = new Event('change');
        selTemplate.dispatchEvent(evt);
    };

    // 프리뷰 업데이트 바인딩
    if(selTemplate && !selTemplate.dataset.bound) {
        selTemplate.dataset.bound = true;
        selTemplate.addEventListener('change', (e) => {
            const msgId = e.target.value;
            const msg = mockDB.messages.find(m => m.id === msgId);
            
            // 패널 하이라이트
            document.querySelectorAll('.msg-tpl-card').forEach(c => c.classList.remove('active'));
            if(msgId) {
                const card = document.querySelector(`.msg-tpl-card[data-id="${msgId}"]`);
                if(card) { card.classList.add('active'); card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
            }

            if(msg) {
                const colorMap = { 'info': '#3b82f6', 'warn': '#f59e0b', 'danger': '#ef4444' };
                prevType.style.borderColor = colorMap[msg.type] || '#475569';
                prevType.style.color = colorMap[msg.type] || '#94a3b8';
                prevType.innerText = typeLabels[msg.type];
                prevText.innerText = msg.body;
            } else {
                prevType.style.borderColor = '#475569';
                prevType.style.color = '#94a3b8';
                prevType.innerText = '선택 대기';
                prevText.innerText = '좌측에서 상황에 맞는 메시지를 선택하세요.';
            }
        });
    }

    // 송출 실행 버튼 
    const btnExecute = document.getElementById('btnExecuteBroadcast');
    if(btnExecute && !btnExecute.dataset.bound) {
        btnExecute.dataset.bound = true;
        btnExecute.addEventListener('click', () => {
            const msgId = selTemplate.value;
            if(!msgId) {
                alert('방송을 송출하려면 먼저 메시지 템플릿을 선택하세요.');
                return;
            }
            const msg = mockDB.messages.find(m => m.id === msgId);
            const target = document.getElementById('selBcastTarget').selectedOptions[0].text;
            
            const statusDiv = document.getElementById('bcastStatus');
            btnExecute.innerHTML = '<span class="icon">⌛</span> 송출 중... 대기';
            btnExecute.style.pointerEvents = 'none';
            btnExecute.style.opacity = '0.5';
            
            setTimeout(() => {
                btnExecute.innerHTML = '<span class="icon" style="font-size:1.5rem;">🔴</span> LIVE 강력 송출 실행';
                btnExecute.style.pointerEvents = 'auto';
                btnExecute.style.opacity = '1';
                
                statusDiv.innerHTML = `[성공] 대상: ${target} / HMD 강제 푸시 완료!`;
                statusDiv.style.opacity = '1';
                
                // 이벤트 로그에 가짜 기록 추가
                mockDB.events.unshift({
                    type: '메시지 송출', title: `안내방송 송출 (${target})`, desc: `송출 완료: "${msg.body}"`, time: '방금 전', cls: 'outline-blue text-blue', icon: '📢'
                });
                
                setTimeout(() => { statusDiv.style.opacity = '0'; }, 3500);
            }, 800);
        });
    }

    // 템플릿 저장 로직
    const btnSave = document.getElementById('btnSaveTemplate');
    if(btnSave && !btnSave.dataset.bound) {
        btnSave.dataset.bound = true;
        btnSave.addEventListener('click', () => {
            const title = document.getElementById('txtMsgTitle').value.trim();
            const body = document.getElementById('txtMsgBody').value.trim();
            const typeNode = document.querySelector('input[name="msgType"]:checked');
            
            if(!title || !body || !typeNode) {
                alert('분류, 제목, 송출 본문을 정확히 입력해주셔야 합니다.');
                return;
            }
            
            const newId = 'M-0' + (mockDB.messages.length + 1);
            mockDB.messages.unshift({
                id: newId,
                title: title,
                type: typeNode.value,
                body: body,
                lastUsed: '조금 전 방금 등록됨'
            });
            
            document.getElementById('txtMsgTitle').value = '';
            document.getElementById('txtMsgBody').value = '';
            
            renderMessageTables();
            window.selectMsgTemplate(newId);
        });
    }
};

// 1. 초기 렌더링 실행
initDashboard();
console.log('✅ VR Platform Dashboard: Migrated to Single Source Mock DB Architecture!');
});
