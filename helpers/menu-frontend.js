const getMenuFrontEnd = (rol = 'USER_ROLE') => {
  const menu = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/dashboard/progress' },
        { titulo: 'Grafica', url: '/dashboard/grafica' },
        { titulo: 'Promesa', url: '/dashboard/promesa' },
        { titulo: 'Rxjs', url: '/dashboard/rxjs' },
      ],
    },
    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        //{ titulo: 'Usuarios', url: '/dashboard/usuarios' },
        { titulo: 'Hospitales', url: '/dashboard/hospitales' },
        { titulo: 'Medicos', url: '/dashboard/medicos' },
      ],
    },
  ];

  if (rol === 'ADMIN_ROLE') {
    menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/dashboard/usuarios' });
  }

  return menu;
};

module.exports = { getMenuFrontEnd };
