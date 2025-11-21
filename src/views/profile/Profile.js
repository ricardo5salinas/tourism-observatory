import React, { useState } from 'react'
import {
	CRow,
	CCol,
	CCard,
	CCardBody,
	CCardHeader,
	CImage,
	CButton,
	CBadge,
	CModal,
	CModalHeader,
	CModalTitle,
	CModalBody,
	CModalFooter,
	CForm,
	CFormLabel,
	CFormInput,
} from '@coreui/react'

const Profile = () => {
	const [showEdit, setShowEdit] = useState(false)
	const [form, setForm] = useState({ nombre: 'María', apellido: 'López', telefono: '+58 412-1234567', email: 'admin@example.com' })

	const user = {
		cedula: 'V-12345678',
		nombre: form.nombre,
		apellido: form.apellido,
		rol: 'Administrador',
		telefono: form.telefono,
		email: form.email,
		createdAt: '2025-10-01',
		updatedAt: '2025-11-02',
		avatar: '/assets/images/avatars/1.jpg',
	}

	const handleEdit = () => setShowEdit(true)

	const handleSave = () => {
		setShowEdit(false)
	}

	return (
		<CRow>
			<CCol xs={12}>
				<CCard className="mb-4">
					<CCardHeader>Perfil de usuario</CCardHeader>
					<CCardBody>
						<div className="profile-card" style={{ maxWidth: 980, margin: '0 auto', boxSizing: 'border-box' }}>
							<style>{`
								.profile-card { border-radius:12px; overflow:hidden; }
								.profile-card .profile-split { display:flex; flex-direction:row; align-items:stretch; }
								.profile-card .profile-left { flex:0 0 320px; background:#fff; padding:24px; display:flex; flex-direction:column; align-items:center; box-sizing:border-box; }
								.profile-card .profile-right { flex:1; padding:24px; background: linear-gradient(120deg, #3e8ef7, #7c3aed); color:#fff; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; }
								.profile-card .avatar { width:160px; height:160px; border-radius:50%; object-fit:cover; box-shadow:0 6px 18px rgba(0,0,0,0.12); border:6px solid #fff; max-width:100%; }
								.profile-card .dates { margin-top:18px; text-align:center; color:#444; }
								.profile-card .dates .label { font-size:12px; color:#888; }
								.profile-card .dates .value { font-weight:700; margin-top:6px; }
								.profile-card .info h2 { margin:0 0 6px 0; font-size:26px; }
								.profile-card .info .meta { color:rgba(255,255,255,0.95); margin-top:10px; }
								.profile-card .info .meta div { margin-bottom:6px; }
								.profile-card .edit-wrap { display:flex; justify-content:flex-end; }
								.profile-card .btn-edit { background:#fff; color:#222; border-radius:6px; padding:10px 20px; font-weight:700; border:none; }
								.profile-card .role-badge { background: rgba(255,255,255,0.18); color: #fff !important; border: 1px solid rgba(255,255,255,0.12); }
								@media (max-width: 768px) { .profile-card .profile-split { flex-direction:column; } .profile-card .profile-left { flex:0 0 auto; width:100%; } .profile-card .profile-right { padding:18px; } .profile-card .edit-wrap { justify-content:center; margin-top:12px; }}
							`}</style>

							<div className="profile-split">
								<div className="profile-left">
									<CImage src={user.avatar} className="avatar" />
									<div className="dates">
										<div className="label">Creado</div>
										<div className="value">{user.createdAt}</div>
										<div className="label" style={{ marginTop: 10 }}>Última edición</div>
										<div className="value">{user.updatedAt}</div>
									</div>
								</div>

								<div className="profile-right">
									<div>
										<div className="info">
											<h2>
												{user.nombre} {user.apellido}{' '}
												<CBadge className="ms-2 role-badge">{user.rol}</CBadge>
											</h2>
											<div className="meta">
												<div><strong>Cédula:</strong> {user.cedula}</div>
												<div><strong>Teléfono:</strong> {user.telefono}</div>
												<div><strong>Correo administrador:</strong> {user.email}</div>
											</div>
										</div>
									</div>

									<div className="edit-wrap">
										<CButton className="btn-edit" onClick={handleEdit}>Editar</CButton>
									</div>
								</div>
							</div>
						</div>
					</CCardBody>
				</CCard>
			</CCol>

			<CModal alignment="center" visible={showEdit} onClose={() => setShowEdit(false)}>
				<CModalHeader>
					<CModalTitle>Editar perfil</CModalTitle>
				</CModalHeader>
				<CModalBody>
					<CForm>
						<div className="mb-3">
							<CFormLabel>Nombre</CFormLabel>
							<CFormInput value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
						</div>
						<div className="mb-3">
							<CFormLabel>Apellido</CFormLabel>
							<CFormInput value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
						</div>
						<div className="mb-3">
							<CFormLabel>Teléfono</CFormLabel>
							<CFormInput value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
						</div>
						<div className="mb-3">
							<CFormLabel>Correo</CFormLabel>
							<CFormInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
						</div>
					</CForm>
				</CModalBody>
				<CModalFooter>
					<CButton color="secondary" onClick={() => setShowEdit(false)}>
						Cancelar
					</CButton>
					<CButton color="primary" onClick={handleSave}>
						Guardar
					</CButton>
				</CModalFooter>
			</CModal>
		</CRow>
	)
}

export default Profile



