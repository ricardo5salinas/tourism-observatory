import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
  CButton,
} from '@coreui/react'
import { CChartDoughnut, CChartBar } from '@coreui/react-chartjs'

const Dashboard = () => {
  // Sample data for charts
  const donutData = {
    labels: ['Turismo', 'Cultura', 'Gastronomía', 'Naturaleza'],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: ['#3e8ef7', '#7c3aed', '#ffb020', '#06b6d4'],
        hoverBackgroundColor: ['#2f6fe0', '#6a2bd6', '#e6a200', '#05a0b0'],
      },
    ],
  }

  const barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Visitas por mes',
        backgroundColor: '#3e8ef7',
        data: [120, 190, 300, 250, 320, 400],
      },
    ],
  }

  // Mock tables
  const latestProjects = [
    { id: 'P-1001', name: 'Mapa de Alojamientos', owner: 'María Lopez', date: '2025-11-01', status: 'Publicado' },
    { id: 'P-1002', name: 'Estadísticas Visitantes 2024', owner: 'Carlos Ruiz', date: '2025-10-24', status: 'Borrador' },
    { id: 'P-1003', name: 'Rutas de Senderismo', owner: 'Ana Gómez', date: '2025-09-12', status: 'Publicado' },
  ]

  const latestDocuments = [
    { id: 'D-3001', title: 'Informe Anual 2024', type: 'PDF', project: 'Estadísticas Visitantes', date: '2025-11-05' },
    { id: 'D-3002', title: 'Manual de Usuario', type: 'DOCX', project: 'Mapa de Alojamientos', date: '2025-10-30' },
    { id: 'D-3003', title: 'Licencias', type: 'PDF', project: 'Rutas de Senderismo', date: '2025-10-01' },
  ]

  const latestUsers = [
    { id: 'U-5001', name: 'Lucía Fernández', email: 'lucia@example.com', role: 'Editor', date: '2025-11-08' },
    { id: 'U-5002', name: 'Miguel Torres', email: 'miguel@example.com', role: 'Administrador', date: '2025-11-02' },
    { id: 'U-5003', name: 'Sofía Ramos', email: 'sofia@example.com', role: 'Viewer', date: '2025-10-28' },
  ]

  return (
    <>
      {/* Quick-actions carousel: 3 taps (aesthetic with captions & controls) */}
      <CCard className="mb-4">
        <CCardBody className="p-0">
          <CCarousel controls indicators>
            <CCarouselItem>
              <div className="d-block w-100 quick-slide slide-1" style={{ minHeight: 160 }} />
              <CCarouselCaption className="text-start d-none d-md-block py-4 px-5">
                <h4>Sube y comparte una nueva línea de proyecto aquí</h4>
                <p className="text-body-secondary">Comparte tus iniciativas con la comunidad del observatorio.</p>
                <CButton color="primary" href="/projects/new">Subir proyecto</CButton>
              </CCarouselCaption>
            </CCarouselItem>
            <CCarouselItem>
              <div className="d-block w-100 quick-slide slide-2" style={{ minHeight: 160 }} />
              <CCarouselCaption className="text-start d-none d-md-block py-4 px-5">
                <h4>Respalda tus documentos aquí</h4>
                <p className="text-body-secondary">Carga y guarda informes, manuales y recursos importantes.</p>
                <CButton color="info" href="/documents/upload">Respaldar documentos</CButton>
              </CCarouselCaption>
            </CCarouselItem>
            <CCarouselItem>
              <div className="d-block w-100 quick-slide slide-3" style={{ minHeight: 160 }} />
              <CCarouselCaption className="text-start d-none d-md-block py-4 px-5">
                <h4>Crea usuarios y expande la comunidad</h4>
                <p className="text-body-secondary">Invita colaboradores, asigna roles y amplía el equipo.</p>
                <CButton color="success" href="/users/new">Crear usuario</CButton>
              </CCarouselCaption>
            </CCarouselItem>
          </CCarousel>
        </CCardBody>
      </CCard>
      {/* Carousel with donut + bar charts */}
      <CCard className="mb-4">
        <CCardHeader>Resumen rápido</CCardHeader>
        <CCardBody>
          <CCarousel>
            <CCarouselItem>
              <CRow>
                <CCol md={6} className="d-flex align-items-center justify-content-center">
                  <div style={{ width: '320px' }}>
                    <CChartDoughnut data={donutData} />
                  </div>
                </CCol>
                <CCol md={6} className="d-flex align-items-center justify-content-center">
                  <div style={{ width: '100%' }}>
                    <CChartBar data={barData} options={{ maintainAspectRatio: false }} style={{ height: '320px' }} />
                  </div>
                </CCol>
              </CRow>
            </CCarouselItem>
            <CCarouselItem>
              <CRow>
                <CCol md={6} className="d-flex align-items-center justify-content-center">
                  <div style={{ width: '320px' }}>
                    <CChartDoughnut data={{ ...donutData, datasets: [{ ...donutData.datasets[0], data: [30,30,25,15] }] }} />
                  </div>
                </CCol>
                <CCol md={6} className="d-flex align-items-center justify-content-center">
                  <div style={{ width: '100%' }}>
                    <CChartBar data={{ ...barData, datasets: [{ ...barData.datasets[0], data: [200,150,240,300,260,350] }] }} options={{ maintainAspectRatio: false }} style={{ height: '320px' }} />
                  </div>
                </CCol>
              </CRow>
            </CCarouselItem>
          </CCarousel>
        </CCardBody>
      </CCard>

      {/* Latest Projects */}
      <CCard className="mb-4">
        <CCardHeader>Últimos proyectos subidos</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Propietario</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {latestProjects.map((p) => (
                <CTableRow key={p.id}>
                  <CTableDataCell>{p.id}</CTableDataCell>
                  <CTableDataCell>{p.name}</CTableDataCell>
                  <CTableDataCell>{p.owner}</CTableDataCell>
                  <CTableDataCell>{p.date}</CTableDataCell>
                  <CTableDataCell>{p.status}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Latest Documents */}
      <CCard className="mb-4">
        <CCardHeader>Últimos documentos agregados</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Título</CTableHeaderCell>
                <CTableHeaderCell>Tipo</CTableHeaderCell>
                <CTableHeaderCell>Proyecto</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {latestDocuments.map((d) => (
                <CTableRow key={d.id}>
                  <CTableDataCell>{d.id}</CTableDataCell>
                  <CTableDataCell>{d.title}</CTableDataCell>
                  <CTableDataCell>{d.type}</CTableDataCell>
                  <CTableDataCell>{d.project}</CTableDataCell>
                  <CTableDataCell>{d.date}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Latest Users */}
      <CCard className="mb-4">
        <CCardHeader>Últimos usuarios registrados</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Nombre</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>Fecha registro</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {latestUsers.map((u) => (
                <CTableRow key={u.id}>
                  <CTableDataCell>{u.id}</CTableDataCell>
                  <CTableDataCell>{u.name}</CTableDataCell>
                  <CTableDataCell>{u.email}</CTableDataCell>
                  <CTableDataCell>{u.role}</CTableDataCell>
                  <CTableDataCell>{u.date}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
