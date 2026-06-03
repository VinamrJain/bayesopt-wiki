cp /usr0/home/kkandasa/projects/Gittins/gc/fidel_space.eps ./figs/
cp /usr0/home/kkandasa/libs/kky-matlab/GPLibkky/gp_bw_sample.eps ./figs/
cp /usr0/home/kkandasa/projects/Gittins/gittins/examples/results/figs/*.eps ./figs/

for f in figs/*.eps
do
  echo "Converting $f"
  epstopdf $f
done
