const isMobile = (userAgent: string): boolean => {
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  return agents.some((agent) => userAgent.indexOf(agent) > 0);
};

export { isMobile };
