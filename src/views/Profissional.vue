<template>
  <div class="bg-white text-blue-900">
    <!-- Top Bar -->
    <div
      class="bg-blue-800 text-white text-sm flex justify-between items-center p-2 px-4"
    >
      <span>
        <i class="fas fa-envelope"></i> Atendimento: presencial das 8h às 16h
      </span>
      <span>
        <i class="fas fa-phone"></i> (83) 3533 - 2515
        <i class="fab fa-instagram mx-2"></i> Instagram
        <i class="fas fa-comments"></i> Ouvidoria
      </span>
    </div>

    <!-- Header -->
    <div class="bg-blue-100 flex items-center justify-between p-4">
      <div class="flex items-center space-x-4">
        <!-- <img src="logo-crea.png" alt="CREA-PB Logo" class="h-12" /> -->
        <div>
          <h1 class="text-3xl font-bold">CREA-PB</h1>
          <p class="text-sm">
            Conselho Regional de Engenharia e Agronomia da Paraíba
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button class="text-yellow-500 font-semibold">Ouvidoria</button>
        <button class="text-yellow-500 font-semibold">
          Transparência e Prestação de Contas
        </button>
        <div class="relative">
          <input
            type="text"
            placeholder="Pesquisar..."
            class="border rounded pl-2 pr-8 py-1"
          />
          <i class="fas fa-search absolute top-1.5 right-2 text-gray-500"></i>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-300 py-2">
      <ul class="flex justify-center space-x-6 font-semibold text-sm">
        <li><a href="#">Início</a></li>
        <li><a href="#">Institucional</a></li>
        <li><a href="#">Serviços</a></li>
        <li><a href="#">Entidades e Instituições</a></li>
        <li><a href="#">Perguntas Frequentes</a></li>
        <li><a href="#">Eleições 2024</a></li>
      </ul>
    </nav>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-xl font-bold mb-6 text-center">Profissional</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <ul class="space-y-2">
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Portal de
            Serviços Profissional
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Visto
            Profissional
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Registro
            Profissional Diplomado no País
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Registro
            Profissional Diplomado no Exterior
          </li>
          <li class="text-gray-400">
            <i class="fas fa-arrow-circle-right"></i> Registro Provisório
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Reativação
            de Registro
          </li>
        </ul>
        <ul class="space-y-2">
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Interrupção
            de Registro
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> 2ª Via de
            Carteira
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i>
            Recadastramento
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Anotação de
            Pós-Graduação
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i> Inclusão de
            Título Profissional
          </li>
          <li>
            <i class="fas fa-arrow-circle-right text-blue-600"></i>
            Reciprocidade Confea/Crea - OEP
          </li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-blue-800 text-white text-sm p-4 text-center">
      <p>
        Conselho Regional de Engenharia e Agronomia da Paraíba – CREA/PB<br />
        Endereço: Av. Dom Pedro I, 809 – Tambiá – João Pessoa – PB. CEP:
        58020-538.<br />
        CNPJ: 08.667.024/0001-00 | Telefone: (83) 3533 2525
      </p>
      <div class="mt-2 flex justify-center space-x-4">
        <!-- <img src="confea.png" alt="Confea" class="h-6" />
        <img src="crea-pb.png" alt="CREA-PB" class="h-6" />
        <img src="mutua.png" alt="Mútua" class="h-6" />
        <img src="ods.png" alt="ODS" class="h-6" /> -->
      </div>
      <p class="mt-2">Todos os direitos reservados a CREA-PB</p>
    </footer>

    <!-- WhatsApp Button -->
    <div class="fixed bottom-4 right-4">
      <a
        href="#"
        class="bg-green-500 text-white px-4 py-2 rounded-full shadow flex items-center space-x-2"
      >
        <i class="fab fa-whatsapp"></i>
        <span>Atendimento Online</span>
      </a>
    </div>
  </div>
</template>

<script setup>
// No logic needed for this static page
</script>

<style scoped lang="scss">
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.bg-white {
  &.text-blue-900 {
    .bg-blue-800 {
      &.text-white {
        &.text-sm {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;

          i {
            margin-right: 0.5rem;
          }
        }
      }
    }

    .bg-blue-100 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;

      .flex {
        &.items-center {
          &.space-x-4 {
            h1 {
              font-size: 1.875rem;
              font-weight: bold;
            }

            p {
              font-size: 0.875rem;
            }
          }
        }

        button {
          &.text-yellow-500 {
            font-weight: 600;
          }
        }

        .relative {
          input {
            border: 1px solid #e2e8f0;
            border-radius: 0.25rem;
            padding: 0.25rem 0.5rem 0.25rem 0.5rem;
          }

          i {
            position: absolute;
            top: 0.375rem;
            right: 0.5rem;
            color: #718096;
          }
        }
      }
    }

    nav {
      &.bg-white {
        border-bottom: 1px solid #e2e8f0;
        padding: 0.5rem 0;

        ul {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }
      }
    }

    .max-w-4xl {
      max-width: 56rem;
      margin: 0 auto;
      padding: 1.5rem;

      h2 {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 1rem;
        font-size: 0.875rem;

        @media (min-width: 640px) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        ul {
          li {
            margin-bottom: 0.5rem;

            i {
              &.text-blue-600 {
                margin-right: 0.5rem;
              }
            }

            &.text-gray-400 {
              color: #a0aec0;
            }
          }
        }
      }
    }

    footer {
      &.bg-blue-800 {
        color: white;
        font-size: 0.875rem;
        padding: 1rem;
        text-align: center;

        p {
          margin-bottom: 0.5rem;
        }

        .mt-2 {
          margin-top: 0.5rem;

          &.flex {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }
        }
      }
    }

    .fixed {
      &.bottom-4 {
        &.right-4 {
          position: fixed;
          bottom: 1rem;
          right: 1rem;

          a {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background-color: #48bb78;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
}
</style>
