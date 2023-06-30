// O objeto 'window' representa a janela do navegador contendo um documento DOM.
// A função addEventListener é um método no objeto 'window' que configura uma função 
// que será chamada sempre que o evento especificado for entregue ao objeto.
// 'DOMContentLoaded' é um evento que é acionado quando o documento HTML inicial 
// foi completamente carregado e analisado, sem aguardar estilosheets, imagens e subframes terminarem de carregar.
window.addEventListener('DOMContentLoaded', (event) => {

    // Variáveis para armazenar a página atual, número de itens por página e 
    // dois arrays para armazenar os dados brutos e os dados filtrados.
    let currentPage = 0;
    const itemsPerPage = 10;
    let data = [];
    let filteredData = [];

    // Função para obter produtos da API usando fetch.
    const fetchProducts = () => {
        // Fetch é uma função embutida para fazer solicitações HTTP no navegador.
        // Esta linha inicia uma solicitação GET para o URL especificado.
        fetch('http://makeup-api.herokuapp.com/api/v1/products.json')
        .then(response => response.json()) // Transforma a resposta em JSON.
        .then(responseData => {
            data = responseData; // Armazena os dados brutos recebidos.
            filteredData = [...data]; // Faz uma cópia dos dados brutos para o array de dados filtrados.
            // [...] é um operador de propagação (spread operator) que 'desempacota' um array ou objeto.
            displayProducts(); // Exibe os produtos na tela.
        })
        .catch((error) => {
            // Imprime qualquer erro que possa ocorrer no console do navegador.
            console.error('Error:', error);
        });
    }

    // Função para filtrar os dados com base na entrada do usuário.
    const filterData = () => {
        // Obtém o valor dos campos de filtro e converte para minúsculas para comparação.
        const nameFilter = document.getElementById('name-filter').value.toLowerCase();
        const brandFilter = document.getElementById('brand-filter').value.toLowerCase();
        const typeFilter = document.getElementById('type-filter').value.toLowerCase();

        // Filtra os dados brutos com base na entrada do usuário.
        filteredData = data.filter(product => {
            // Verifica se o nome, marca e tipo do produto correspondem à entrada do usuário.
            // O método includes() verifica se a string contém a sub-string especificada.
            const nameMatches = product.name.toLowerCase().includes(nameFilter);
            const brandMatches = product.brand ? product.brand.toLowerCase().includes(brandFilter) : false;
            const typeMatches = product.product_type.toLowerCase().includes(typeFilter);

            // Retorna verdadeiro apenas se todos os filtros corresponderem.
            return nameMatches && brandMatches && typeMatches;
        });

        // Redefine a página atual para 0 após cada filtragem.
        currentPage = 0;
    }

    // Função para exibir produtos na tela.
    const displayProducts = () => {
        // Obtém o elemento DOM 'products'.
        let products = document.getElementById('products');
        // Limpa o conteúdo do elemento 'products'.
        products.innerHTML = '';

        // Calcula o índice de início e fim para a paginação.
        let start = currentPage * itemsPerPage;
        let end = start + itemsPerPage;

        // Pega uma 'fatia' dos dados filtrados para exibição.
        let pageData = filteredData.slice(start, end);

        // Se a 'fatia' estiver vazia, exibe uma mensagem informando que nenhum produto foi encontrado.
        if(pageData.length === 0) {
            products.innerHTML = "<p>No products found.</p>";
            return;
        }

        // Para cada produto nos dados da página, cria um card de produto e o adiciona ao elemento 'products'.
        pageData.forEach(product => {
            // Cria um novo elemento div e define sua classe como 'product-card'.
            let card = document.createElement('div');
            card.className = 'product-card';

            // Cria um novo elemento img e define seu src como o link da imagem do produto.
            let img = document.createElement('img');
            img.src = product.image_link;
            // Adiciona um manipulador de eventos onerror à imagem. 
            // Se a imagem não puder ser carregada, substitui o src por um URL de imagem padrão.
            img.onerror = () => {
                img.src = 'https://cdn-icons-png.flaticon.com/512/1024/1024505.png';
            };

            // Cria um novo elemento h2 e define seu conteúdo de texto como o nome do produto.
            let title = document.createElement('h2');
            title.textContent = product.name;

            // Cria um novo elemento p, define sua classe como 'price-badge' e define seu conteúdo de texto como o preço do produto.
            let price = document.createElement('p');
            price.className = 'price-badge';
            price.textContent = `R$ ${product.price}`;

            // Adiciona os elementos img, title e price ao card.
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(price);

            // Adiciona o card ao elemento 'products'.
            products.appendChild(card);
        });
    }

    // Adiciona um manipulador de evento 'input' aos campos de filtro.
    // Quando o valor do campo de filtro muda, os dados são filtrados e os produtos são exibidos novamente.
    document.getElementById('name-filter').addEventListener('input', () => {
        filterData();
        displayProducts();
    });
    document.getElementById('brand-filter').addEventListener('input', () => {
        filterData();
        displayProducts();
    });
    document.getElementById('type-filter').addEventListener('input', () => {
        filterData();
        displayProducts();
    });

    // Busca os produtos quando a página é carregada pela primeira vez.
    fetchProducts();
});

