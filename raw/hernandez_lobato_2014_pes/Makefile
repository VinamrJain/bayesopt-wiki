esbald.pdf: esbald.tex sections/*.tex
MAIN = esbald.tex
PDF = $(patsubst %.tex, %.pdf, $(MAIN))
BIB = $(patsubst %.tex, %.bib, $(MAIN))
SECTIONS = $(wildcard sections/*.tex)

$(PDF): $(MAIN) $(SECTIONS) $(BIB)
	latexmk -bibtex -pdf $<

clean:
	latexmk -bibtex -CA

