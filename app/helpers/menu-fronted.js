const getMenuFrontend = (role = 'OPERADOR') => {
  
    if(role === 'ADMINISTRADOR' || role === 'DESARROLLADOR') return getMenuRolAdmin();
    if(role === 'USUARIO') return getMenuRolUsuario();
    if(role === 'CONSULTOR') return getMenuRolConsultor();
    return [];
  }
  
  const getMenuRolAdmin = () => {
    return [
      { 
        title: 'Dashboard',
        url: '/capacitacion/home',
        icon: 'home',
      },
      { 
        title: 'Cursos',
        url: '/capacitacion/curso',
        icon: 'school',
      },
      { 
        title: 'Capacitaciones',
        url: '/capacitacion/capacitacion',
        icon: 'reduce_capacity',
      },
      { 
        title: 'Funcionario',
        url: '/capacitacion/funcionario',
        icon: 'person',
      },
      { 
        label: 'Principal',
        items:[
          { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/capacitacion/home'] }
        ],
      },
      { 
        label: 'Cursos',
        items:[
          { label: 'Cursos', icon: 'pi pi-fw pi-book', routerLink: ['/capacitacion/cursos'] }
        ],        
      },
      { 
        label: 'Capacitaciones',
        items:[
          { label: 'Capacitaciones', icon: 'pi pi-fw pi-id-card', routerLink: ['/capacitacion/capacitacion'] }
        ],                
      },
      { 
        label: 'Funcionario',
        items:[
          { label: 'Funcionario', icon: 'pi pi-fw pi-user', routerLink: ['/capacitacion/funcionario'] }
        ],                
        
      },
      { 
        label: 'Resap',
        items:[
          { label: 'Criterio Evaluacion', icon: 'pi pi-fw pi-verified', routerLink: ['/capacitacion/criterio_evaluacion'] }
        ],                
        
      },
    ];
  }
  
  const getMenuRolUsuario = () => {
    return [
      { 
        label: 'Principal',
        items:[
          { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/capacitacion/home'] }
        ],
      },
      { 
        label: 'Capacitaciones',
        items:[
          { label: 'Capacitacion', icon: 'pi pi-fw pi-id-card', routerLink: ['/capacitacion/capacitacion/usuario'] }
        ],                
      },
      { 
        label: 'Curso',
        items:[
          { label: 'Mis Cursos', icon: 'pi pi-fw pi-book', routerLink: ['/capacitacion/empleado/capacitacion/',{isEmp:'true'}] }
        ],                
      },
      
      { 
        title: 'Dashboard',
        url: '/capacitacion/home',
        icon: 'home',
      },
      { 
        title: 'Capacitaciones',
        url: '/capacitacion/capacitacion/usuario',
        icon: 'school',
      },
      { 
        title: 'Curso',
        url: '/capacitacion/curso/empleado',
        icon: 'history_edu',
      },
    ];
  }
  
  const getMenuRolConsultor = () => {
    return [
      { 
        title: 'Consultas / Reportes',
        url: 'reports/assignments',
        icon: 'fa-solid fa-magnifying-glass',
      },
      { 
        title: 'Acerca de',
        url: 'acerca-de',
        icon: 'fa-solid fa-circle-info',
      },
    ];
  }
  
  module.exports = {
      getMenuFrontend
  }