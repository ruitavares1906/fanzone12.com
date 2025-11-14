-- Script para inserir avaliações fictícias para todos os produtos exceto a camisola do Sporting 25/26 (ID 21)

-- Avaliações para Camisola SL Benfica 2024/25 Principal (ID 1)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('1', 'João Silva', 'joao.silva@email.com', 'Excelente qualidade!', 'Comprei esta camisola e estou muito satisfeito. O material é de alta qualidade e o design é fiel ao original.', 5),
('1', 'Maria Santos', 'maria.santos@email.com', 'Entrega rápida', 'Recebi a camisola em apenas 3 dias. Muito satisfeita com a qualidade e o serviço.', 5),
('1', 'Pedro Costa', 'pedro.costa@email.com', 'Tamanho um pouco pequeno', 'A camisola é bonita e de boa qualidade, mas veste um pouco pequena. Recomendo pedir um tamanho acima.', 4),
('1', 'Ana Ferreira', 'ana.ferreira@email.com', 'Presente perfeito', 'Comprei para oferecer ao meu namorado e ele adorou! Qualidade excelente.', 5);

-- Avaliações para Camisola SL Benfica 2024/25 Alternativa (ID 2)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('2', 'Ricardo Oliveira', 'ricardo.oliveira@email.com', 'Design incrível', 'O design desta camisola alternativa é fantástico. Muito original e de boa qualidade.', 5),
('2', 'Sofia Martins', 'sofia.martins@email.com', 'Boa relação qualidade-preço', 'Bom produto pelo preço. Recomendo.', 4),
('2', 'Tiago Almeida', 'tiago.almeida@email.com', 'Entrega demorada', 'A camisola é boa, mas a entrega demorou mais do que o esperado.', 3);

-- Avaliações para Camisola FC Porto 2024/25 Principal (ID 3)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('3', 'Miguel Rodrigues', 'miguel.rodrigues@email.com', 'Qualidade superior', 'Esta camisola do Porto é de excelente qualidade. As cores são vibrantes e o material é muito bom.', 5),
('3', 'Carla Sousa', 'carla.sousa@email.com', 'Perfeita', 'Exatamente como na imagem. Muito satisfeita com a compra.', 5),
('3', 'Bruno Fernandes', 'bruno.fernandes@email.com', 'Boa camisola', 'Boa qualidade, mas o preço podia ser um pouco mais baixo.', 4);

-- Avaliações para Camisola FC Porto 2024/25 Alternativa (ID 4)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('4', 'Luís Gonçalves', 'luis.goncalves@email.com', 'Design único', 'Adoro o design desta camisola alternativa. Muito original!', 5),
('4', 'Marta Ribeiro', 'marta.ribeiro@email.com', 'Boa qualidade', 'Material de boa qualidade e acabamentos perfeitos.', 4);

-- Avaliações para Camisola FC Porto 2024/25 Terceira (ID 5)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('5', 'Paulo Mendes', 'paulo.mendes@email.com', 'Elegante e confortável', 'Esta terceira camisola do Porto é muito elegante e confortável de usar.', 5),
('5', 'Inês Costa', 'ines.costa@email.com', 'Presente de aniversário', 'Comprei para o aniversário do meu irmão e ele adorou!', 5),
('5', 'Rui Pereira', 'rui.pereira@email.com', 'Cor um pouco diferente', 'A cor é um pouco diferente da imagem, mas ainda assim é uma boa camisola.', 4);

-- Avaliações para Camisola Sporting CP 2024/25 Principal (ID 6)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('6', 'André Santos', 'andre.santos@email.com', 'Qualidade excelente', 'A camisola do Sporting é de excelente qualidade. Recomendo!', 5),
('6', 'Catarina Silva', 'catarina.silva@email.com', 'Entrega rápida', 'Recebi a camisola em apenas 2 dias. Muito satisfeita!', 5),
('6', 'Diogo Martins', 'diogo.martins@email.com', 'Tamanho perfeito', 'O tamanho corresponde exatamente ao esperado. Muito confortável.', 4);

-- Avaliações para Camisola Sporting CP 2024/25 Alternativa (ID 7)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('7', 'Filipe Rodrigues', 'filipe.rodrigues@email.com', 'Design moderno', 'Adoro o design desta camisola alternativa. Muito moderna!', 5),
('7', 'Joana Ferreira', 'joana.ferreira@email.com', 'Boa qualidade', 'Material de boa qualidade e acabamentos perfeitos.', 4);

-- Avaliações para Camisola Portugal 2024 Principal (ID 8)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('8', 'Nuno Alves', 'nuno.alves@email.com', 'Orgulho nacional', 'Excelente camisola para apoiar a seleção. Qualidade superior!', 5),
('8', 'Teresa Lopes', 'teresa.lopes@email.com', 'Presente perfeito', 'Comprei para oferecer ao meu pai e ele adorou!', 5),
('8', 'Vasco Sousa', 'vasco.sousa@email.com', 'Boa camisola', 'Boa qualidade, mas o preço podia ser um pouco mais baixo.', 4);

-- Avaliações para Camisola Portugal 2024 Alternativa (ID 9)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('9', 'Hugo Ribeiro', 'hugo.ribeiro@email.com', 'Design inovador', 'Adoro o design desta camisola alternativa de Portugal. Muito original!', 5),
('9', 'Leonor Cunha', 'leonor.cunha@email.com', 'Boa qualidade', 'Material de boa qualidade e acabamentos perfeitos.', 4);

-- Avaliações para Camisola Barcelona 2023/24 Principal (ID 10)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('10', 'Daniel Oliveira', 'daniel.oliveira@email.com', 'Excelente réplica', 'Esta camisola do Barcelona é uma excelente réplica. Muito satisfeito!', 5),
('10', 'Sara Pereira', 'sara.pereira@email.com', 'Presente para o meu filho', 'O meu filho adorou esta camisola do Barcelona. Qualidade muito boa!', 5);

-- Avaliações para Camisola Real Madrid 2023/24 Principal (ID 11)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('11', 'Gonçalo Dias', 'goncalo.dias@email.com', 'Qualidade superior', 'Esta camisola do Real Madrid é de excelente qualidade. As cores são vibrantes e o material é muito bom.', 5),
('11', 'Mariana Costa', 'mariana.costa@email.com', 'Perfeita', 'Exatamente como na imagem. Muito satisfeita com a compra.', 5),
('11', 'Tomás Ferreira', 'tomas.ferreira@email.com', 'Boa camisola', 'Boa qualidade, mas o preço podia ser um pouco mais baixo.', 4);

-- Avaliações para Camisola Manchester United 2023/24 Principal (ID 12)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('12', 'Francisco Sousa', 'francisco.sousa@email.com', 'Excelente qualidade', 'Esta camisola do Manchester United é de excelente qualidade. Recomendo!', 5),
('12', 'Beatriz Santos', 'beatriz.santos@email.com', 'Entrega rápida', 'Recebi a camisola em apenas 3 dias. Muito satisfeita!', 5),
('12', 'Rodrigo Almeida', 'rodrigo.almeida@email.com', 'Tamanho um pouco grande', 'A camisola é bonita e de boa qualidade, mas veste um pouco grande. Recomendo pedir um tamanho abaixo.', 4);

-- Avaliações para Camisola Liverpool 2023/24 Principal (ID 13)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('13', 'Duarte Ribeiro', 'duarte.ribeiro@email.com', 'Design clássico', 'Adoro o design clássico desta camisola do Liverpool. Muito bonita!', 5),
('13', 'Carolina Martins', 'carolina.martins@email.com', 'Boa qualidade', 'Material de boa qualidade e acabamentos perfeitos.', 4);

-- Avaliações para Camisola Brasil 2024 Principal (ID 14)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('14', 'Gustavo Ferreira', 'gustavo.ferreira@email.com', 'Cores vibrantes', 'As cores desta camisola do Brasil são muito vibrantes. Qualidade excelente!', 5),
('14', 'Lara Costa', 'lara.costa@email.com', 'Presente perfeito', 'Comprei para oferecer ao meu irmão e ele adorou!', 5),
('14', 'Mateus Silva', 'mateus.silva@email.com', 'Boa camisola', 'Boa qualidade, mas o preço podia ser um pouco mais baixo.', 4);

-- Avaliações para Camisola Argentina 2024 Principal (ID 15)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('15', 'Lucas Oliveira', 'lucas.oliveira@email.com', 'Qualidade superior', 'Esta camisola da Argentina é de excelente qualidade. As cores são vibrantes e o material é muito bom.', 5),
('15', 'Sofia Rodrigues', 'sofia.rodrigues@email.com', 'Perfeita', 'Exatamente como na imagem. Muito satisfeita com a compra.', 5),
('15', 'Gabriel Santos', 'gabriel.santos@email.com', 'Boa camisola', 'Boa qualidade, mas o preço podia ser um pouco mais baixo.', 4);

-- Avaliações para Camisola França 2024 Principal (ID 16)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('16', 'Afonso Pereira', 'afonso.pereira@email.com', 'Design elegante', 'O design desta camisola da França é muito elegante. Qualidade excelente!', 5),
('16', 'Matilde Alves', 'matilde.alves@email.com', 'Presente perfeito', 'Comprei para oferecer ao meu namorado e ele adorou!', 5),
('16', 'Henrique Costa', 'henrique.costa@email.com', 'Boa camisola', 'Boa qualidade, mas o preço podia ser um pouco mais baixo.', 4);

-- Avaliações para Camisola Personalizada - Modelo Básico (ID 17)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('17', 'Martim Fernandes', 'martim.fernandes@email.com', 'Personalização perfeita', 'A personalização ficou perfeita! Muito satisfeito com o resultado.', 5),
('17', 'Clara Ribeiro', 'clara.ribeiro@email.com', 'Boa qualidade', 'Material de boa qualidade e a personalização ficou muito bem feita.', 4);

-- Avaliações para Camisola Personalizada - Modelo Premium (ID 18)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('18', 'Santiago Sousa', 'santiago.sousa@email.com', 'Qualidade premium', 'Esta camisola personalizada premium é realmente de alta qualidade. Recomendo!', 5),
('18', 'Alice Martins', 'alice.martins@email.com', 'Entrega rápida', 'Recebi a camisola em apenas 4 dias, mesmo com personalização. Muito satisfeita!', 5),
('18', 'Dinis Almeida', 'dinis.almeida@email.com', 'Personalização impecável', 'A personalização ficou impecável. Muito satisfeito com o resultado.', 5);

-- Avaliações para Camisola Retrô Benfica 1961/62 (ID 19)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('19', 'Vicente Oliveira', 'vicente.oliveira@email.com', 'Peça histórica', 'Esta camisola retrô do Benfica é uma verdadeira peça histórica. Qualidade excelente!', 5),
('19', 'Leonor Santos', 'leonor.santos@email.com', 'Presente para o meu pai', 'Comprei para o meu pai que é um grande benfiquista e ele adorou! Trouxe-lhe muitas memórias.', 5),
('19', 'Simão Ferreira', 'simao.ferreira@email.com', 'Boa qualidade', 'Material de boa qualidade e design fiel ao original.', 4);

-- Avaliações para Camisola Retrô Portugal 2004 (ID 20)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('20', 'Lourenço Costa', 'lourenco.costa@email.com', 'Memórias do Euro 2004', 'Esta camisola traz-me excelentes memórias do Euro 2004. Qualidade muito boa!', 5),
('20', 'Margarida Ribeiro', 'margarida.ribeiro@email.com', 'Design icónico', 'Design icónico e qualidade excelente. Muito satisfeita com a compra.', 5),
('20', 'Guilherme Alves', 'guilherme.alves@email.com', 'Boa réplica', 'Boa réplica da camisola de 2004. Material de qualidade.', 4);

-- Avaliações para Camisola Vitória SC 2024/25 Principal (ID 22)
INSERT INTO avaliacoes (produto_id, nome, email, titulo, conteudo, classificacao)
VALUES 
('22', 'Eduardo Sousa', 'eduardo.sousa@email.com', 'Qualidade surpreendente', 'A qualidade desta camisola do Vitória SC surpreendeu-me positivamente. Recomendo!', 5),
('22', 'Diana Martins', 'diana.martins@email.com', 'Entrega rápida', 'Recebi a camisola em apenas 3 dias. Muito satisfeita!', 5),
('22', 'Bernardo Almeida', 'bernardo.almeida@email.com', 'Design elegante', 'O design é muito elegante e a qualidade é excelente.', 5);
