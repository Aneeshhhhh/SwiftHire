import { useEffect, useMemo, useState } from 'react';

const API_BASE = '/api';

const emptyEmployeeForm = {
  name: '',
  profession: '',
  age: '',
  salary: ''
};

const emptyPositionForm = {
  title: '',
  department: '',
  compensation: ''
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm);
  const [positionForm, setPositionForm] = useState(emptyPositionForm);
  const [employeeQuery, setEmployeeQuery] = useState('');
  const [positionQuery, setPositionQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [status, setStatus] = useState('Loading live hiring data...');
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    refreshAll();
  }, []);

  const visibleEmployees = useMemo(() => {
    const query = employeeQuery.trim().toLowerCase();
    if (!query) {
      return employees;
    }

    return employees.filter((employee) =>
      [employee.name, employee.profession, String(employee.age), String(employee.salary)]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [employees, employeeQuery]);

  const visiblePositions = useMemo(() => {
    const query = positionQuery.trim().toLowerCase();
    if (!query) {
      return positions;
    }

    return positions.filter((position) =>
      [position.title, position.department, String(position.compensation)]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [positions, positionQuery]);

  const matchCount = useMemo(() => {
    if (!employees.length || !positions.length) {
      return 0;
    }

    return employees.filter((employee) =>
      positions.some((position) => {
        const employeeProfession = employee.profession?.toLowerCase() ?? '';
        const positionTitle = position.title?.toLowerCase() ?? '';
        return positionTitle.includes(employeeProfession) || employeeProfession.includes(positionTitle);
      })
    ).length;
  }, [employees, positions]);

  async function refreshAll() {
    setBusy(true);
    setStatus('Syncing workers and roles...');

    try {
      const [employeeResponse, positionResponse] = await Promise.all([
        fetch(`${API_BASE}/employees`),
        fetch(`${API_BASE}/positions`)
      ]);

      if (!employeeResponse.ok || !positionResponse.ok) {
        throw new Error('Failed to load data');
      }

      const [employeeData, positionData] = await Promise.all([
        employeeResponse.json(),
        positionResponse.json()
      ]);

      setEmployees(employeeData);
      setPositions(positionData);
      setStatus('Live data synced');
    } catch (error) {
      setStatus('Backend unavailable. Start the Spring Boot app and retry.');
    } finally {
      setBusy(false);
    }
  }

  async function refreshEmployees(url = `${API_BASE}/employees`) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load employees');
    }

    const data = await response.json();
    setEmployees(data);
    return data;
  }

  async function refreshPositions() {
    const response = await fetch(`${API_BASE}/positions`);
    if (!response.ok) {
      throw new Error('Failed to load positions');
    }

    const data = await response.json();
    setPositions(data);
    return data;
  }

  async function handleEmployeeSubmit(event) {
    event.preventDefault();

    const payload = {
      name: employeeForm.name.trim(),
      profession: employeeForm.profession.trim(),
      age: Number(employeeForm.age),
      salary: Number(employeeForm.salary)
    };

    const url = editingEmployeeId ? `${API_BASE}/employees/${editingEmployeeId}` : `${API_BASE}/employees`;
    const method = editingEmployeeId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert('Could not save worker profile.');
      return;
    }

    setEmployeeForm(emptyEmployeeForm);
    setEditingEmployeeId(null);
    setSelectedEmployee(null);
    setStatus(editingEmployeeId ? 'Worker profile updated' : 'Worker profile created');
    await refreshEmployees();
  }

  async function handlePositionSubmit(event) {
    event.preventDefault();

    const payload = {
      title: positionForm.title.trim(),
      department: positionForm.department.trim(),
      compensation: Number(positionForm.compensation)
    };

    const url = editingPositionId ? `${API_BASE}/positions/${editingPositionId}` : `${API_BASE}/positions`;
    const method = editingPositionId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert('Could not save role.');
      return;
    }

    setPositionForm(emptyPositionForm);
    setEditingPositionId(null);
    setSelectedPosition(null);
    setStatus(editingPositionId ? 'Role updated' : 'Role created');
    await refreshPositions();
  }

  async function searchWorkersByProfession(profession) {
    setEmployeeQuery(profession);
    setStatus(`Filtering workers by ${profession}`);
    await refreshEmployees(`${API_BASE}/employees/search?profession=${encodeURIComponent(profession)}`);
  }

  async function showAllWorkers() {
    setEmployeeQuery('');
    setStatus('Showing all workers');
    await refreshAll();
  }

  function clearPositionQuery() {
    setPositionQuery('');
    setStatus('Showing all roles');
  }

  function clearEmployeeEdit() {
    setEmployeeForm(emptyEmployeeForm);
    setEditingEmployeeId(null);
  }

  function clearPositionEdit() {
    setPositionForm(emptyPositionForm);
    setEditingPositionId(null);
  }

  async function deleteEmployee(id) {
    if (!window.confirm('Delete this worker profile?')) {
      return;
    }

    const response = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await refreshEmployees();
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(null);
      }
      setStatus('Worker removed');
    }
  }

  async function deletePosition(id) {
    if (!window.confirm('Delete this role?')) {
      return;
    }

    const response = await fetch(`${API_BASE}/positions/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await refreshPositions();
      if (selectedPosition?.id === id) {
        setSelectedPosition(null);
      }
      setStatus('Role removed');
    }
  }

  function startEmployeeEdit(employee) {
    setSelectedEmployee(employee);
    setEditingEmployeeId(employee.id);
    setEmployeeForm({
      name: employee.name ?? '',
      profession: employee.profession ?? '',
      age: employee.age ?? '',
      salary: employee.salary ?? ''
    });
  }

  function startPositionEdit(position) {
    setSelectedPosition(position);
    setEditingPositionId(position.id);
    setPositionForm({
      title: position.title ?? '',
      department: position.department ?? '',
      compensation: position.compensation ?? ''
    });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">SwiftHire</div>
          <div className="subtitle">Blue-collar hiring for crews, contractors, and field teams</div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={refreshAll}>
            Refresh
          </button>
          <div className="status-pill">{busy ? 'Syncing' : status}</div>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">Hire fast. Dispatch faster.</span>
          <h1>Match local talent with real jobs in one dashboard.</h1>
          <p>
            SwiftHire is designed for the hiring reality of site crews, workshops, and service teams: no fluff,
            no long funnels, just live workers, open roles, and quick decisions.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => document.getElementById('workers').scrollIntoView({ behavior: 'smooth' })}>
              See workers
            </button>
            <button className="secondary-button" onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}>
              Post roles
            </button>
          </div>
        </div>

        <div className="hero-metrics">
          <Metric label="Workers" value={employees.length} tone="blue" />
          <Metric label="Open roles" value={positions.length} tone="green" />
          <Metric label="Potential matches" value={matchCount} tone="amber" />
        </div>
      </section>

      <section className="match-board">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Selected worker</h2>
              <p>Click a worker card to inspect, edit, or remove it.</p>
            </div>
            <button className="ghost-button" onClick={() => setSelectedEmployee(null)}>
              Clear
            </button>
          </div>
          {selectedEmployee ? (
            <DetailCard title={selectedEmployee.name} subtitle={selectedEmployee.profession} lines={[
              `Age ${selectedEmployee.age}`,
              `Salary expectation ${currency(selectedEmployee.salary)}`
            ]} />
          ) : (
            <Placeholder text="Select a worker to see details here." />
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Selected role</h2>
              <p>Click a role card to inspect, edit, or remove it.</p>
            </div>
            <button className="ghost-button" onClick={() => setSelectedPosition(null)}>
              Clear
            </button>
          </div>
          {selectedPosition ? (
            <DetailCard title={selectedPosition.title} subtitle={selectedPosition.department} lines={[
              `Compensation ${currency(selectedPosition.compensation)}`
            ]} />
          ) : (
            <Placeholder text="Select a role to see details here." />
          )}
        </div>
      </section>

      <section className="two-column">
        <div className="panel" id="workers">
          <div className="panel-head">
            <div>
              <h2>Workers</h2>
              <p>Live employee profiles from /api/employees.</p>
            </div>
            <button className="ghost-button" onClick={clearEmployeeEdit}>
              New worker
            </button>
          </div>

          <div className="filter-row">
            <input
              value={employeeQuery}
              onChange={(event) => setEmployeeQuery(event.target.value)}
              placeholder="Search by name, profession, age, or salary"
            />
            <div className="chip-row">
              {['Electrician', 'Driver', 'Plumber', 'Welder'].map((profession) => (
                <button key={profession} className="chip" onClick={() => searchWorkersByProfession(profession)}>
                  {profession}
                </button>
              ))}
              <button className="chip ghost-chip" onClick={showAllWorkers}>
                All workers
              </button>
            </div>
          </div>

          <form className="stack" onSubmit={handleEmployeeSubmit}>
            <div className="form-grid">
              <label>
                Name
                <input
                  value={employeeForm.name}
                  onChange={(event) => setEmployeeForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Aneesh Kumar"
                  required
                />
              </label>
              <label>
                Profession
                <input
                  value={employeeForm.profession}
                  onChange={(event) => setEmployeeForm((current) => ({ ...current, profession: event.target.value }))}
                  placeholder="Electrician"
                  required
                />
              </label>
              <label>
                Age
                <input
                  type="number"
                  value={employeeForm.age}
                  onChange={(event) => setEmployeeForm((current) => ({ ...current, age: event.target.value }))}
                  placeholder="28"
                  min="1"
                  required
                />
              </label>
              <label>
                Salary
                <input
                  type="number"
                  value={employeeForm.salary}
                  onChange={(event) => setEmployeeForm((current) => ({ ...current, salary: event.target.value }))}
                  placeholder="45000"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
            </div>

            <div className="action-row">
              <button className="primary-button" type="submit">
                {editingEmployeeId ? 'Update worker' : 'Add worker'}
              </button>
              {editingEmployeeId ? (
                <button className="secondary-button" type="button" onClick={clearEmployeeEdit}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>

          <div className="record-list">
            {visibleEmployees.length === 0 ? (
              <Placeholder text="No workers match the current filter." />
            ) : (
              visibleEmployees.map((employee) => (
                <RecordCard
                  key={employee.id}
                  title={employee.name}
                  subtitle={employee.profession}
                  meta={[`Age ${employee.age}`, currency(employee.salary)]}
                  selected={selectedEmployee?.id === employee.id}
                  onSelect={() => setSelectedEmployee(employee)}
                  onEdit={() => startEmployeeEdit(employee)}
                  onDelete={() => deleteEmployee(employee.id)}
                  badge="Ready to work"
                />
              ))
            )}
          </div>
        </div>

        <div className="panel" id="roles">
          <div className="panel-head">
            <div>
              <h2>Open roles</h2>
              <p>Live positions from /api/positions.</p>
            </div>
            <button className="ghost-button" onClick={clearPositionEdit}>
              New role
            </button>
          </div>

          <div className="filter-row">
            <input
              value={positionQuery}
              onChange={(event) => setPositionQuery(event.target.value)}
              placeholder="Search by title, department, or compensation"
            />
            <div className="chip-row">
              {['Operations', 'Field', 'Maintenance', 'Warehouse'].map((department) => (
                <button key={department} className="chip" onClick={() => setPositionQuery(department)}>
                  {department}
                </button>
              ))}
              <button className="chip ghost-chip" onClick={clearPositionQuery}>
                All roles
              </button>
            </div>
          </div>

          <form className="stack" onSubmit={handlePositionSubmit}>
            <div className="form-grid">
              <label>
                Title
                <input
                  value={positionForm.title}
                  onChange={(event) => setPositionForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Site Supervisor"
                  required
                />
              </label>
              <label>
                Department
                <input
                  value={positionForm.department}
                  onChange={(event) => setPositionForm((current) => ({ ...current, department: event.target.value }))}
                  placeholder="Operations"
                  required
                />
              </label>
              <label>
                Compensation
                <input
                  type="number"
                  value={positionForm.compensation}
                  onChange={(event) => setPositionForm((current) => ({ ...current, compensation: event.target.value }))}
                  placeholder="60000"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
            </div>

            <div className="action-row">
              <button className="primary-button" type="submit">
                {editingPositionId ? 'Update role' : 'Add role'}
              </button>
              {editingPositionId ? (
                <button className="secondary-button" type="button" onClick={clearPositionEdit}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>

          <div className="record-list">
            {visiblePositions.length === 0 ? (
              <Placeholder text="No roles match the current filter." />
            ) : (
              visiblePositions.map((position) => (
                <RecordCard
                  key={position.id}
                  title={position.title}
                  subtitle={position.department}
                  meta={[currency(position.compensation), 'Hiring now']}
                  selected={selectedPosition?.id === position.id}
                  onSelect={() => setSelectedPosition(position)}
                  onEdit={() => startPositionEdit(position)}
                  onDelete={() => deletePosition(position.id)}
                  badge="Open role"
                  accent="gold"
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className={`metric metric-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function RecordCard({ title, subtitle, meta, badge, accent = 'blue', selected, onSelect, onEdit, onDelete }) {
  return (
    <article className={`record-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="record-main">
        <div>
          <div className="record-title">{title}</div>
          <div className="record-subtitle">{subtitle}</div>
        </div>
        <span className={`badge badge-${accent}`}>{badge}</span>
      </div>

      <div className="record-meta">
        {meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="card-actions">
        <button
          className="text-button"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          Edit
        </button>
        <button
          className="text-button danger"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function DetailCard({ title, subtitle, lines }) {
  return (
    <div className="detail-card">
      <div className="detail-title">{title}</div>
      <div className="detail-subtitle">{subtitle}</div>
      <div className="detail-lines">
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ text }) {
  return <div className="placeholder">{text}</div>;
}

function currency(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(number);
}

export default App;