
library(ggplot2)

load("resultsBald.dat")
load("resultsES.dat")
load("resultsEI.dat")

medianDistanceFunctionValueBald <- log(apply(resultsBald, 2, median)) / log(10)
medianDistanceFunctionValueEI <- log(apply(resultsEI, 2, median)) / log(10)
medianDistanceFunctionValueES <- log(apply(resultsES, 2, median)) / log(10)

# We estimate the error bars for the medians by bootstrap

nSamples <- 1000
sampledMediansBald <- matrix(0, nSamples, length(medianDistanceFunctionValueBald))
sampledMediansEI <- matrix(0, nSamples, length(medianDistanceFunctionValueEI))
sampledMediansES <- matrix(0, nSamples, length(medianDistanceFunctionValueES))

for (i in 1 : nSamples) {

	resultsBaldBootstrap <- resultsBald[ sample(1 : nrow(resultsBald), replace = T), ]
	resultsEIBootstrap <- resultsEI[ sample(1 : nrow(resultsEI), replace = T), ]
	resultsESBootstrap <- resultsES[ sample(1 : nrow(resultsES), replace = T), ]

	sampledMediansBald[ i, ] <- log(apply(resultsBaldBootstrap, 2, median)) / log(10)
	sampledMediansEI[ i, ] <- log(apply(resultsEIBootstrap, 2, median)) / log(10)
	sampledMediansES[ i, ] <- log(apply(resultsESBootstrap, 2, median)) / log(10)

	print(i)
}

sdMedianDistanceFunctionValueBald <- apply(sampledMediansBald, 2, sd)
sdMedianDistanceFunctionValueEI <- apply(sampledMediansEI, 2, sd)
sdMedianDistanceFunctionValueES <- apply(sampledMediansES, 2, sd)

resultsBald <- cbind(rep("PES", length(medianDistanceFunctionValueBald)), medianDistanceFunctionValueBald, sdMedianDistanceFunctionValueBald,
	seq(1,  length(medianDistanceFunctionValueBald)))
resultsES <- cbind(rep("ES", length(medianDistanceFunctionValueES)), medianDistanceFunctionValueES, sdMedianDistanceFunctionValueES,
	seq(1,  length(medianDistanceFunctionValueES)))
resultsEI <- cbind(rep("EI", length(medianDistanceFunctionValueEI)), medianDistanceFunctionValueEI, sdMedianDistanceFunctionValueEI,
	seq(1,  length(medianDistanceFunctionValueEI)))

results <- rbind(resultsBald, resultsES, resultsEI)

results <- data.frame(Methods = as.factor(results[ , 1 ]), median = as.double(results[ , 2 ] ), sd = as.double(results[ , 3 ]),
	iteration = as.double(results[ , 4 ]))

ggplot(results, aes(x = iteration, y = median, colour = Methods)) + 
    geom_errorbar(aes(ymin = median - sd, ymax = median + sd), width = 0.5, size = 0.75) +
    ylab("Log10 Median IR") +
    xlab("Number of Function Evaluations") +
    geom_line() +
    labs(title="Results on Synthetic Cost Functions") +
    geom_point(size = 2) +
    theme_bw() +
    theme(legend.justification = c(0, 0), legend.position= c(0, 0)) +
    geom_line(size = 0.75) +
    scale_y_continuous(breaks = round(seq(min(results$median), max(results$median), by = 1), 1)) +
    theme(plot.title = element_text(size = 20, face = "bold")) +
    theme(axis.title=element_text(size = 20, face = "bold")) +
    theme(axis.text.x = element_text(angle = 00, hjust = 0.5, size=20, color="black")) +
    theme(axis.text.y = element_text(angle = 00, hjust = 0.5, size=20, color="black")) +
    scale_color_manual(values=c("#000000", "#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7"))
ggsave("rawFigure.pdf", width = 9, height = 6)
