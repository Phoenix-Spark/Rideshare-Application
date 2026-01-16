export function formatName(name: string){
      return name.slice(0, 1).toUpperCase() + name.slice(1)
}

export function displayName(firstName: string, lastName: string){
      return formatName(firstName) + " " + formatName(lastName)
}