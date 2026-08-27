const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug']
const current = [118,121,128,139,151,165,177,172]
const previous = [112,115,121,132,145,158,169,166]

function points(values:number[]){
  const min=105,max=182,w=660,h=205
  return values.map((v,i)=>`${(i/(values.length-1))*w},${h-((v-min)/(max-min))*h}`).join(' ')
}

export default function Dashboard(){
  const departments=[['F&B',43],['Housekeeping',36],['Front Office',24],['Kitchen',21],['Engineering',14],['Sales & Revenue',12],['Finance',8],['Other',14]]
  const activity=[
    ['in','Lucía Martín','Front Office · Receptionist','Onboarding verified'],
    ['out','Daniel Ruiz','F&B · Waiter','Offboarding in progress'],
    ['pending','María López','Housekeeping · Supervisor','IHG verification pending'],
    ['in','Javier Santos','Kitchen · Chef de Partie','New hire scheduled'],
  ]
  return <div className="page">
    <div className="page-head"><div><span className="eyebrow">WORKFORCE & ACCESS</span><h1>Hotel overview</h1><p>Estado de plantilla, identidades, licencias y controles del mes.</p></div><button className="button">+ Nuevo onboarding</button></div>
    <div className="kpi-grid">
      <div className="card kpi"><div className="kpi-label">Empleados activos</div><div className="kpi-value">172</div><div className="delta good">+3.6% vs Aug 2025</div></div>
      <div className="card kpi"><div className="kpi-label">Altas este mes</div><div className="kpi-value">14</div><div className="delta">8 verificadas · 6 en proceso</div></div>
      <div className="card kpi"><div className="kpi-label">Licencias M365</div><div className="kpi-value">148</div><div className="delta warn">2 discrepancias por revisar</div></div>
      <div className="card kpi"><div className="kpi-label">Acciones IT pendientes</div><div className="kpi-value">7</div><div className="delta bad">2 requieren atención hoy</div></div>
    </div>
    <div className="grid-2">
      <section className="card panel"><div className="panel-head"><div><h2>Evolución de plantilla</h2><span>Closing headcount · 2026 vs 2025</span></div><span>Aug 2026 · 172</span></div>
        <svg className="chart" viewBox="-10 -10 700 250" role="img" aria-label="Headcount trend">
          {[0,1,2,3].map(i=><line key={i} x1="0" x2="660" y1={i*55} y2={i*55} stroke="#edf0f4" />)}
          <polyline points={points(previous)} className="chart-line alt"/><polyline points={points(current)} className="chart-line"/>
          {current.map((v,i)=><circle key={i} cx={(i/(current.length-1))*660} cy={205-((v-105)/(182-105))*205} r="4" className="chart-dot"/>)}
          {months.map((m,i)=><text key={m} x={(i/(months.length-1))*660} y="228" textAnchor="middle" className="axis-label">{m}</text>)}
        </svg><div className="legend"><span><i/>2026</span><span className="alt"><i/>2025</span></div>
      </section>
      <section className="card panel"><div className="panel-head"><div><h2>Personas por departamento</h2><span>Distribución actual</span></div></div><div className="dept-list">{departments.map(([name,count])=><div className="dept-row" key={name}><span>{name}</span><div className="bar"><span style={{width:`${Number(count)/43*100}%`}}/></div><strong>{count}</strong></div>)}</div></section>
    </div>
    <div className="grid-2">
      <section className="card panel"><div className="panel-head"><div><h2>Movimientos recientes</h2><span>Altas, bajas y verificaciones</span></div><span>Ver todos</span></div><div className="activity-list">{activity.map(([type,name,desc,state])=><div className="activity" key={name}><span className={`activity-dot ${type==='out'?'out':type==='pending'?'pending':''}`}/><div><strong>{name}</strong><span>{desc}</span></div><span className={`status ${type==='pending'||type==='out'?'warning':''}`}>{state}</span></div>)}</div></section>
      <section className="card panel"><div className="panel-head"><div><h2>Control de fuentes</h2><span>Últimos archivos y reconciliaciones</span></div></div><table className="table"><thead><tr><th>Fuente</th><th>Última carga</th><th>Estado</th></tr></thead><tbody><tr><td>IHG Access Report</td><td>26 Aug</td><td><span className="status">OK</span></td></tr><tr><td>M365 Licenses</td><td>26 Aug</td><td><span className="status warning">2 diferencias</span></td></tr><tr><td>Factorial</td><td>31 Jul</td><td><span className="status warning">Pendiente Aug</span></td></tr><tr><td>Oracle Opera</td><td>19 Aug</td><td><span className="status">OK</span></td></tr></tbody></table></section>
    </div>
  </div>
}
