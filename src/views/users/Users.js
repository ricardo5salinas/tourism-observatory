import React, { useMemo, useState } from 'react'
import userApi from '../../api/endpoints/usersApi'
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CInputGroup,
    CFormInput,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormLabel,
    CFormSelect,
} from '@coreui/react'

const Users = () => {
	const [search, setSearch] = useState('')

	
	const initialUsers = [
		{
			id: 1,
			cedula: 'V-12345678',
			nombre: 'María',
			apellido: 'López',
			rol: 'Administrador',
			createdAt: '2025-10-01',
			updatedAt: '2025-11-02',
		},
		{
			id: 2,
			cedula: 'V-87654321',
			nombre: 'Carlos',
			apellido: 'Ruiz',
			rol: 'Coordinador',
			createdAt: '2025-09-12',
			updatedAt: '2025-10-20',
		},
		{
			id: 3,
			cedula: 'E-11223344',
			nombre: 'Ana',
			apellido: 'Gómez',
			rol: 'Profesor',
			createdAt: '2025-11-05',
			updatedAt: '2025-11-06',
		},
	]

	const [users, setUsers] = useState([])
	const [showCreate, setShowCreate] = useState(false)
 	const [showEdit, setShowEdit] = useState(false)
 	const [editForm, setEditForm] = useState(null)
	const [showDelete, setShowDelete] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState(null)
	const [createForm, setCreateForm] = useState({ dni: '', first_name: '', last_name: '', email: '', role_id: 1 })
	React.useEffect(() => {
		userApi
			.getUsers()
			.then((res) => {
				// Normalize possible response shapes into an array
				const d = res && res.data ? res.data : res
				let items = []
				if (Array.isArray(d)) items = d
				else if (Array.isArray(d?.data)) items = d.data
				else if (Array.isArray(d?.users)) items = d.users
				else items = []
				setUsers(items)
			})
			.catch(() => setUsers([]))
	}, [])

	// Helpers to safely extract specific display fields from different API shapes
	const getFirstName = (u) => {
		if (!u) return ''
		if (u.first_name) return u.first_name
		if (u.nombre) return u.nombre
		if (u.firstName) return u.firstName
		if (u.name) return u.name
		if (u.fullName) return String(u.fullName).split(' ')[0]
		return ''
	}

	const getLastName = (u) => {
		if (!u) return ''
		if (u.last_name) return u.last_name
		if (u.apellido) return u.apellido
		if (u.lastName) return u.lastName
		if (u.fullName) return String(u.fullName).split(' ').slice(1).join(' ')
		return ''
	}

	const getDni = (u) => {
		if (!u) return ''
		return u.dni || u.cedula || u.document || u.idNumber || ''
	}

	const getEmail = (u) => {
		if (!u) return ''
		return u.email || u.email_address || u.username || ''
	}

	const getRole = (u) => {
		if (!u) return 'N/D'
		// Casos comunes: 'rol' (es), 'role', 'role_name', o { role: { role_name }} o roles: [{role_name}]
		if (typeof u === 'string') return u
		if (u.rol) return u.rol
		if (u.role && typeof u.role === 'string') return u.role
		if (u.role_name) return u.role_name
		if (u.role && typeof u.role === 'object') {
			if (u.role.role_name) return u.role.role_name
			if (u.role.name) return u.role.name
		}
		if (Array.isArray(u.roles) && u.roles.length > 0) {
			const r0 = u.roles[0]
			if (!r0) return 'N/D'
			return r0.role_name || r0.name || 'N/D'
		}
		return 'N/D'
	}

	const getRoleColor = (u) => {
		const role = String(getRole(u) || '').toLowerCase()
		if (role.includes('admin') || role.includes('administrador')) return 'primary'
		if (role.includes('cordinator')) return 'success'
		if (role.includes('teacher') || role.includes('profesor')) return 'info'
		return 'secondary'
	}

	// Extrae un id fiable de diferentes formas que pueda devolver la API
	const extractId = (u) => {
		if (!u) return null
		return u.id ?? u._id ?? u.userId ?? u.user_id ?? u.idNumber ?? u.dni ?? null
	}

	const formatDate = (val) => {
		if (!val) return ''
		try {
			// Accept ISO or date-only strings
			if (typeof val === 'string' && val.includes('T')) return val.split('T')[0]
			return new Date(val).toISOString().slice(0, 10)
		} catch (e) {
			return String(val)
		}
	}

	const filtered = useMemo(() => {
		const list = Array.isArray(users) ? users : []
		if (!search) return list
		const q = search.toLowerCase()
		return list.filter((u) => {
			return (
				(String(getDni(u) || '')).toLowerCase().includes(q) ||
				(`${String(getFirstName(u) || '')} ${String(getLastName(u) || '')}`).toLowerCase().includes(q) ||
				(String(getRole(u) || '')).toLowerCase().includes(q) ||
				(String(getEmail(u) || '')).toLowerCase().includes(q)
			)
		})
	}, [search, users])

	const handleCreate = () => setShowCreate(true)
/*faltaba una e en handle y shworeate*/
	const handleSaveCreate = async () => {
		if (!createForm.dni || !createForm.first_name) {
			alert('Por favor rellena DNI y Nombre')
			return
		}
		const payload = {
			first_name: createForm.first_name,
			last_name: createForm.last_name,
			dni: createForm.dni,
			email: createForm.email,
			role_id: createForm.role_id,
		}
		try {
			const res = await userApi.createUser(payload)
			const raw = res?.data ?? res
			const created = raw?.user ?? raw?.data ?? raw ?? payload
			if (!extractId(created)) created.id = created.id ?? created._id ?? null
			setUsers((prev) => [created, ...prev])
		} catch (e) {
			alert('Error creando usuario')
		}
		setShowCreate(false)
		setCreateForm({ dni: '', first_name: '', last_name: '', email: '', role_id: 1 })
	}

	const handleEdit = (user) => {
		setEditForm({
			id: extractId(user),
			dni: user.dni || user.cedula || '',
			first_name: user.first_name || user.nombre || '',
			last_name: user.last_name || user.apellido || '',
			email: user.email || '',
			role_id: user.role_id || user.roleId || user.role_id || null,
		})
		setShowEdit(true)
	}

	const handleSaveEdit = async () => {
		if (!editForm) return
		const id = editForm.id ?? extractId(editForm)
		if (!id) {
			alert('Imposible actualizar: id del usuario no encontrado')
			return
		}
		const payload = {
			first_name: editForm.first_name,
			last_name: editForm.last_name,
			dni: editForm.dni,
			email: editForm.email,
			role_id: editForm.role_id,
		}
		try {
			const res = await userApi.updateUser(id, payload)
			const raw = res?.data ?? res
			const updated = raw?.user ?? raw?.data ?? raw ?? payload
			// Ensure updated object has an id we can compare
			if (!extractId(updated)) updated.id = id
			setUsers((prev) => prev.map((u) => ((extractId(u) === id) ? updated : u)))
			setShowEdit(false)
			setEditForm(null)
		} catch (e) {
			alert('Error actualizando usuario')
		}
	}

	const handleDelete = (user) => {
		setDeleteTarget(user)
		setShowDelete(true)
	}

	const confirmDelete = async () => {
		if (!deleteTarget) return
		const id = extractId(deleteTarget)
		if (!id) {
			alert('Imposible eliminar: id del usuario no encontrado')
			return
		}
		try {
			console.debug('confirmDelete: deleting id=', id, 'target=', deleteTarget)
			const res = await userApi.deleteUser(id)
			console.debug('confirmDelete: delete response=', res)
			const status = res?.status ?? (res && res.data && res.data.status) ?? null
			if (status && !(status >= 200 && status < 300)) {
				alert('El servidor respondió con estado ' + status)
			}
			// Remove from local state regardless of server body when successful HTTP status
			setUsers((prev) => prev.filter((u) => extractId(u) !== id))
			setShowDelete(false)
			setDeleteTarget(null)
		} catch (e) {
			console.error('confirmDelete error', e)
			alert('Error eliminando usuario: ' + (e?.response?.status ? ('status ' + e.response.status) : e.message))
		}
	}

	return (
		<>
			<CRow className="mb-4">
				<CCol xs={12}>
					<CCard>
						<CCardHeader>
							<CRow className="align-items-center">
								<CCol md={8} className="d-flex justify-content-center">
									<div style={{ width: '100%', maxWidth: 720 }}>
										<CInputGroup>
											<CFormInput
												placeholder="Buscar por c.i, nombre o rol..."
												value={search}
												onChange={(e) => setSearch(e.target.value)}
											/>
											<CButton color="secondary" onClick={() => setSearch('')}>Limpiar</CButton>
										</CInputGroup>
									</div>
								</CCol>
								<CCol md={4} className="d-flex justify-content-end">
									<CButton color="primary" onClick={handleCreate}>Crear nuevo usuario</CButton>
								</CCol>
							</CRow>
						</CCardHeader>
						<CCardBody>
							<CTable hover responsive>
								<CTableHead>
									<CTableRow>
										<CTableHeaderCell scope="col">Cédula</CTableHeaderCell>
										<CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
										<CTableHeaderCell scope="col">Apellido</CTableHeaderCell>
										<CTableHeaderCell scope="col">Rol</CTableHeaderCell>
										<CTableHeaderCell scope="col">Creado</CTableHeaderCell>
										<CTableHeaderCell scope="col">Editado</CTableHeaderCell>
										<CTableHeaderCell scope="col" style={{ width: 160 }}>Acciones</CTableHeaderCell>
									</CTableRow>
								</CTableHead>
								<CTableBody>
									{filtered.map((u) => {
										const firstName = getFirstName(u)
										const lastName = getLastName(u)
										return (
											<CTableRow key={u.id || u._id || JSON.stringify(u)}>
												<CTableDataCell>{getDni(u) || u.id || ''}</CTableDataCell>
												<CTableDataCell>{firstName}</CTableDataCell>
												<CTableDataCell>{lastName}</CTableDataCell>
												<CTableDataCell>
													<CBadge color={getRoleColor(u)}>
														{getRole(u)}
													</CBadge>
												</CTableDataCell>
												<CTableDataCell>{formatDate(u.createdAt || u.created_at)}</CTableDataCell>
												<CTableDataCell>{formatDate(u.updatedAt || u.updated_at)}</CTableDataCell>
												<CTableDataCell>
													<CButton size="sm" color="info" className="me-2" onClick={() => handleEdit(u)}>
														Editar
													</CButton>
													<CButton size="sm" color="danger" onClick={() => handleDelete(u)}>
														Eliminar
													</CButton>
												</CTableDataCell>
											</CTableRow>
										)
									})}
								</CTableBody>
							</CTable>
						</CCardBody>
					</CCard>
				</CCol>
			</CRow>

									<CModal visible={showCreate} onClose={() => setShowCreate(false)}> 
					<CModalHeader>
						<CModalTitle>Crear nuevo usuario</CModalTitle>
					</CModalHeader>
					<CModalBody>
						<CForm>
							<div className="mb-3">
								<CFormLabel>DNI</CFormLabel>
								<CFormInput value={createForm.dni} onChange={(e) => setCreateForm({ ...createForm, dni: e.target.value })} />
							</div>
							<div className="mb-3">
								<CFormLabel>Nombre</CFormLabel>
								<CFormInput value={createForm.first_name} onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })} />
							</div>
							<div className="mb-3">
								<CFormLabel>Apellido</CFormLabel>
								<CFormInput value={createForm.last_name} onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })} />
							</div>
							<div className="mb-3">
								<CFormLabel>Email</CFormLabel>
								<CFormInput value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
							</div>
							<div className="mb-3">
								<CFormLabel>Rol</CFormLabel>
								<CFormSelect value={createForm.role_id} onChange={(e) => setCreateForm({ ...createForm, role_id: Number(e.target.value) })}>
									<option value={1}>Administrador</option>
									<option value={2}>Coordinador</option>
									<option value={3}>Profesor</option>
								</CFormSelect>
							</div>
						</CForm>
					</CModalBody>
					<CModalFooter>
						<CButton color="secondary" onClick={() => setShowCreate(false)}>Cancelar</CButton>
												<CButton color="primary" onClick={handleSaveCreate}>Crear</CButton>
					</CModalFooter>
				</CModal>

										{/* Edit modal */}
										<CModal visible={showEdit} onClose={() => setShowEdit(false)}>
											<CModalHeader>
												<CModalTitle>Editar usuario</CModalTitle>
											</CModalHeader>
											<CModalBody>
												<CForm>
													<div className="mb-3">
														<CFormLabel>DNI</CFormLabel>
														<CFormInput value={editForm?.dni || ''} onChange={(e) => setEditForm({ ...editForm, dni: e.target.value })} />
													</div>
													<div className="mb-3">
														<CFormLabel>Nombre</CFormLabel>
														<CFormInput value={editForm?.first_name || ''} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} />
													</div>
													<div className="mb-3">
														<CFormLabel>Apellido</CFormLabel>
														<CFormInput value={editForm?.last_name || ''} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} />
													</div>
													<div className="mb-3">
														<CFormLabel>Email</CFormLabel>
														<CFormInput value={editForm?.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
													</div>
													<div className="mb-3">
														<CFormLabel>Rol</CFormLabel>
														<CFormSelect value={editForm?.role_id || ''} onChange={(e) => setEditForm({ ...editForm, role_id: Number(e.target.value) })}>
															<option value={1}>Administrador</option>
															<option value={2}>Coordinador</option>
															<option value={3}>Profesor</option>
														</CFormSelect>
													</div>
												</CForm>
											</CModalBody>
											<CModalFooter>
												<CButton color="secondary" onClick={() => setShowEdit(false)}>Cancelar</CButton>
												<CButton color="primary" onClick={handleSaveEdit}>Guardar</CButton>
											</CModalFooter>
										</CModal>

										{/* Delete confirmation modal */}
										<CModal visible={showDelete} onClose={() => setShowDelete(false)}>
											<CModalHeader>
												<CModalTitle>Eliminar usuario</CModalTitle>
											</CModalHeader>
											<CModalBody>
												{deleteTarget ? (
													<p>¿Eliminar usuario <strong>{getFirstName(deleteTarget)} {getLastName(deleteTarget)}</strong> (ID: {getDni(deleteTarget) || deleteTarget.id})?</p>
												) : (
													<p>¿Eliminar usuario?</p>
												)}
											</CModalBody>
											<CModalFooter>
												<CButton color="secondary" onClick={() => setShowDelete(false)}>Cancelar</CButton>
												<CButton color="danger" onClick={confirmDelete}>Eliminar</CButton>
											</CModalFooter>
										</CModal>
		</>
	)

}
export default Users

