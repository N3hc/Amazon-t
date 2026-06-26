import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Read initial language from localStorage or default to 'en'
  private activeLang = signal<string>(localStorage.getItem('lang') || 'en');

  // Translation dictionary
  private dictionary: { [key: string]: { [lang: string]: string } } = {
    'search': {
      'en': 'Search',
      'es': 'Buscar'
    },
    'search_placeholder': {
      'en': 'Search card or set...',
      'es': 'Buscar carta o set...'
    },
    'hello': {
      'en': 'Hello',
      'es': 'Hola'
    },
    'sign_in': {
      'en': 'Sign in',
      'es': 'Iniciar sesión'
    },
    'account_lists': {
      'en': 'Account & Lists',
      'es': 'Cuenta y Listas'
    },
    'view_profile': {
      'en': 'View Profile',
      'es': 'Ver Perfil'
    },
    'sign_out': {
      'en': 'Sign Out',
      'es': 'Cerrar Sesión'
    },
    'cart': {
      'en': 'Your Shopping Cart',
      'es': 'Tu Carrito de Compras'
    },
    'items_in_cart': {
      'en': 'items in your cart',
      'es': 'artículos en tu carrito'
    },
    'empty_cart': {
      'en': 'Your cart feels lonely',
      'es': 'Tu carrito se siente solo'
    },
    'start_shopping': {
      'en': 'Start Shopping',
      'es': 'Empezar a Comprar'
    },
    'continue_shopping': {
      'en': 'Continue Shopping',
      'es': 'Continuar Comprando'
    },
    'each': {
      'en': 'each',
      'es': 'c/u'
    },
    'order_summary': {
      'en': 'Order Summary',
      'es': 'Resumen de Orden'
    },
    'subtotal': {
      'en': 'Subtotal',
      'es': 'Subtotal'
    },
    'shipping': {
      'en': 'Shipping',
      'es': 'Envío'
    },
    'free': {
      'en': 'Free',
      'es': 'Gratis'
    },
    'total': {
      'en': 'Total',
      'es': 'Total'
    },
    'checkout_now': {
      'en': 'Checkout Now',
      'es': 'Proceder al Pago'
    },
    'secure_checkout': {
      'en': 'Secure Checkout',
      'es': 'Pago Seguro'
    },
    'secure_checkout_desc': {
      'en': 'Your payment information is processed securely. We don\'t store your credit card details.',
      'es': 'Tu información de pago se procesa de forma segura. No almacenamos los datos de tu tarjeta.'
    },
    'user_profile': {
      'en': 'User Profile',
      'es': 'Perfil de Usuario'
    },
    'manage_profile': {
      'en': 'Manage your personal information',
      'es': 'Gestiona tu información personal'
    },
    'personal_info': {
      'en': 'Personal Information',
      'es': 'Información Personal'
    },
    'first_name': {
      'en': 'First Name',
      'es': 'Nombre'
    },
    'last_name': {
      'en': 'Last Name',
      'es': 'Apellido'
    },
    'email': {
      'en': 'Email Address',
      'es': 'Correo Electrónico'
    },
    'username': {
      'en': 'Username',
      'es': 'Nombre de Usuario'
    },
    'birth_date': {
      'en': 'Birth Date',
      'es': 'Fecha de Nacimiento'
    },
    'gender': {
      'en': 'Gender',
      'es': 'Género'
    },
    'male': {
      'en': 'Male',
      'es': 'Masculino'
    },
    'female': {
      'en': 'Female',
      'es': 'Femenino'
    },
    'other': {
      'en': 'Other',
      'es': 'Otro'
    },
    'password': {
      'en': 'New Password',
      'es': 'Nueva Contraseña'
    },
    'admin_role': {
      'en': 'Admin Role',
      'es': 'Rol de Administrador'
    },
    'vendor_status': {
      'en': 'Vendor Status',
      'es': 'Estado de Vendedor'
    },
    'save_changes': {
      'en': 'Save Changes',
      'es': 'Guardar Cambios'
    },
    'edit_profile': {
      'en': 'Edit Profile',
      'es': 'Editar Perfil'
    },
    'cancel': {
      'en': 'Cancel',
      'es': 'Cancelar'
    },
    'completed_tickets': {
      'en': 'Completed Tickets',
      'es': 'Tickets Completados'
    },
    'no_completed_tickets': {
      'en': 'No completed tickets',
      'es': 'No hay tickets completados'
    },
    'ticket_details': {
      'en': 'Ticket Details',
      'es': 'Detalles del Ticket'
    },
    'select_ticket_desc': {
      'en': 'Select a ticket to view details',
      'es': 'Selecciona un ticket para ver los detalles'
    },
    'payment_methods': {
      'en': 'Payment Methods',
      'es': 'Métodos de Pago'
    },
    'user_address': {
      'en': 'User Address',
      'es': 'Dirección del Usuario'
    },
    'security_settings': {
      'en': 'Security Settings',
      'es': 'Ajustes de Seguridad'
    },
    'two_factor': {
      'en': 'Two-Factor Authentication',
      'es': 'Autenticación de Dos Factores'
    },
    'enable': {
      'en': 'Enable',
      'es': 'Habilitar'
    },
    'add_product': {
      'en': 'Add New Product',
      'es': 'Agregar Nuevo Producto'
    },
    'quantity': {
      'en': 'Quantity',
      'es': 'Cantidad'
    },
    'price': {
      'en': 'Price',
      'es': 'Precio'
    },
    'condition': {
      'en': 'Condition',
      'es': 'Estado'
    },
    'poor': {
      'en': 'Poor',
      'es': 'Defectuoso'
    },
    'fair': {
      'en': 'Fair',
      'es': 'Aceptable'
    },
    'good': {
      'en': 'Good',
      'es': 'Bueno'
    },
    'very_good': {
      'en': 'Very Good',
      'es': 'Muy Bueno'
    },
    'excellent': {
      'en': 'Excellent',
      'es': 'Excelente'
    },
    'publish_product': {
      'en': 'Publish Product',
      'es': 'Publicar Producto'
    },
    'loading_cards': {
      'en': 'Loading cards...',
      'es': 'Cargando cartas...'
    },
    'back_to_products': {
      'en': 'Back to Products',
      'es': 'Volver a Productos'
    },
    'add_to_cart': {
      'en': 'Add to Cart',
      'es': 'Añadir al Carrito'
    },
    'add_to_favorites': {
      'en': 'Add to Favorites',
      'es': 'Añadir a Favoritos'
    },
    'abilities': {
      'en': 'Abilities',
      'es': 'Habilidades'
    },
    'attacks': {
      'en': 'Attacks',
      'es': 'Ataques'
    },
    'damage': {
      'en': 'Damage',
      'es': 'Daño'
    },
    'none': {
      'en': 'None',
      'es': 'Ninguno'
    },
    'not_available': {
      'en': 'Not available',
      'es': 'No disponible'
    },
    'back': {
      'en': 'Back',
      'es': 'Atrás'
    },
    'continue': {
      'en': 'Continue',
      'es': 'Continuar'
    },
    'loading_sets': {
      'en': 'Loading sets...',
      'es': 'Cargando sets...'
    },
    'email_address': {
      'en': 'Email Address',
      'es': 'Correo Electrónico'
    },
    'invalid_email': {
      'en': 'Invalid email format',
      'es': 'Formato de correo inválido'
    },
    'password_placeholder': {
      'en': 'Password',
      'es': 'Contraseña'
    },
    'invalid_password': {
      'en': 'Password must be at least 6 characters',
      'es': 'La contraseña debe tener al menos 6 caracteres'
    },
    'log_in': {
      'en': 'Log In',
      'es': 'Iniciar Sesión'
    },
    'forgot_password': {
      'en': 'Forgot password?',
      'es': '¿Olvidaste tu contraseña?'
    },
    'dont_have_account': {
      'en': "Don't have an account?",
      'es': '¿No tienes una cuenta?'
    },
    'register_here': {
      'en': 'Register here',
      'es': 'Regístrate aquí'
    },
    'continue_without_account': {
      'en': 'Continue without account',
      'es': 'Continuar sin cuenta'
    },
    'full_name': {
      'en': 'Full Name',
      'es': 'Nombre Completo'
    },
    'your_full_name': {
      'en': 'Your full name',
      'es': 'Tu nombre completo'
    },
    'invalid_name': {
      'en': 'Invalid name',
      'es': 'Nombre inválido'
    },
    'repeat_password': {
      'en': 'Repeat Password',
      'es': 'Repetir Contraseña'
    },
    'passwords_dont_match': {
      'en': 'Passwords do not match',
      'es': 'Las contraseñas no coinciden'
    },
    'invalid_confirm_password': {
      'en': 'Invalid password confirmation',
      'es': 'Confirmación de contraseña inválida'
    },
    'account_type': {
      'en': 'Account Type',
      'es': 'Tipo de Cuenta'
    },
    'client': {
      'en': 'Client',
      'es': 'Cliente'
    },
    'vendor': {
      'en': 'Vendor',
      'es': 'Vendedor'
    },
    'man': {
      'en': 'Man',
      'es': 'Hombre'
    },
    'woman': {
      'en': 'Woman',
      'es': 'Mujer'
    },
    'accept_terms': {
      'en': 'I accept the',
      'es': 'Acepto los'
    },
    'terms_conditions': {
      'en': 'terms and conditions',
      'es': 'términos y condiciones'
    },
    'register': {
      'en': 'Register',
      'es': 'Registrarse'
    },
    'already_have_account': {
      'en': 'Already have an account?',
      'es': '¿Ya tienes una cuenta?'
    },
    'login_here': {
      'en': 'Login here',
      'es': 'Iniciar sesión aquí'
    },
    'continue_without_logging': {
      'en': 'Continue without logging in',
      'es': 'Continuar sin iniciar sesión'
    },
    'previous_product': {
      'en': 'Previous product',
      'es': 'Producto anterior'
    },
    'next_product': {
      'en': 'Next product',
      'es': 'Producto siguiente'
    },
    'name': {
      'en': 'Name',
      'es': 'Nombre'
    },
    'release_date': {
      'en': 'Release Date',
      'es': 'Fecha de Lanzamiento'
    },
    'legalities': {
      'en': 'Legalities',
      'es': 'Legalidad'
    },
    'loading': {
      'en': 'Loading...',
      'es': 'Cargando...'
    },
    'step_set': {
      'en': 'Set',
      'es': 'Set'
    },
    'step_card': {
      'en': 'Card',
      'es': 'Carta'
    },
    'step_details': {
      'en': 'Details',
      'es': 'Detalles'
    },
    'search_set_placeholder': {
      'en': 'Search set by name or ID...',
      'es': 'Buscar set por nombre o ID...'
    },
    'released': {
      'en': 'Released',
      'es': 'Lanzamiento'
    },
    'cards_count': {
      'en': 'cards',
      'es': 'cartas'
    },
    'total_cards': {
      'en': 'Total Cards',
      'es': 'Cartas Totales'
    },
    'price_eur': {
      'en': 'Price (€)',
      'es': 'Precio (€)'
    },
    'product_summary': {
      'en': 'Product Summary',
      'es': 'Resumen de Producto'
    },
    'no_card_selected': {
      'en': 'No card selected',
      'es': 'Ninguna carta seleccionada'
    },
    'no_set_selected': {
      'en': 'No set selected',
      'es': 'Ningún set seleccionado'
    },
    'unit_price': {
      'en': 'Unit Price',
      'es': 'Precio Unitario'
    },
    'min_unit_required': {
      'en': 'Minimum 1 unit required',
      'es': 'Se requiere mínimo 1 unidad'
    },
    'invalid_price_format': {
      'en': 'Invalid price format',
      'es': 'Formato de precio inválido'
    },
    'edit_mode': {
      'en': 'Edit mode',
      'es': 'Modo edición'
    },
    'view_mode': {
      'en': 'View mode',
      'es': 'Modo visualización'
    },
    'submit': {
      'en': 'Submit',
      'es': 'Enviar'
    },
    'delete': {
      'en': 'Delete',
      'es': 'Eliminar'
    },
    'edit': {
      'en': 'Edit',
      'es': 'Editar'
    },
    'sales_statistics': {
      'en': 'Sales Statistics',
      'es': 'Estadísticas de Ventas'
    },
    'total_sales': {
      'en': 'Total Sales',
      'es': 'Ventas Totales'
    },
    'vs_last_year': {
      'en': 'vs last year',
      'es': 'vs el año pasado'
    },
    'avg_order': {
      'en': 'Avg. Order',
      'es': 'Promedio de Orden'
    },
    'vs_last_month': {
      'en': 'vs last month',
      'es': 'vs el mes pasado'
    },
    'total_orders': {
      'en': 'Total Orders',
      'es': 'Pedidos Totales'
    },
    'top_product': {
      'en': 'Top Product',
      'es': 'Producto Estrella'
    },
    'units_sold': {
      'en': 'units sold',
      'es': 'unidades vendidas'
    },
    'sales_overview': {
      'en': 'Sales Overview',
      'es': 'Resumen de Ventas'
    },
    'privacy_policy': {
      'en': 'Privacy Policy',
      'es': 'Política de Privacidad'
    },
    'terms_service': {
      'en': 'Terms of Service',
      'es': 'Términos de Servicio'
    },
    'contact_us': {
      'en': 'Contact Us',
      'es': 'Contáctanos'
    },
    'copyright': {
      'en': 'All rights reserved.',
      'es': 'Todos los derechos reservados.'
    },
    'created': {
      'en': 'Created',
      'es': 'Creado'
    },
    'add_address': {
      'en': '+ Add Address',
      'es': '+ Añadir Dirección'
    },
    'address_label': {
      'en': 'Address',
      'es': 'Dirección'
    },
    'address_required': {
      'en': 'Address is required',
      'es': 'La dirección es requerida'
    },
    'number_label': {
      'en': 'Number',
      'es': 'Número'
    },
    'number_required': {
      'en': 'Number is required',
      'es': 'El número es requerido'
    },
    'save': {
      'en': 'Save',
      'es': 'Guardar'
    },
    'card_type': {
      'en': 'Card Type',
      'es': 'Tipo de Tarjeta'
    },
    'card_number': {
      'en': 'Card Number',
      'es': 'Número de Tarjeta'
    },
    'invalid_card_number': {
      'en': 'Invalid card number (16 digits)',
      'es': 'Número de tarjeta inválido (16 dígitos)'
    },
    'expiration_date': {
      'en': 'Expiration Date',
      'es': 'Fecha de Vencimiento'
    },
    'invalid_expiration': {
      'en': 'Format MM/YY',
      'es': 'Formato MM/AA'
    },
    'cvv': {
      'en': 'CVV',
      'es': 'CVV'
    },
    'invalid_cvv': {
      'en': '3-digit code',
      'es': 'Código de 3 dígitos'
    },
    'save_payment_method': {
      'en': 'Save Payment Method',
      'es': 'Guardar Método de Pago'
    },
    'expires': {
      'en': 'Expires',
      'es': 'Vence'
    },
    'add_card': {
      'en': '+ Add Card',
      'es': '+ Añadir Tarjeta'
    }
  };

  getCurrentLanguage() {
    return this.activeLang();
  }

  setLanguage(lang: string) {
    if (lang === 'en' || lang === 'es') {
      this.activeLang.set(lang);
      localStorage.setItem('lang', lang);
      // Trigger reload to refresh API calls with new language headers
      window.location.reload();
    }
  }

  translate(key: string): string {
    const translation = this.dictionary[key];
    if (!translation) return key;
    return translation[this.activeLang()] || translation['en'] || key;
  }
}
